import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  tipo: z.string(),
  contratanteNome: z.string(),
  contratanteDoc: z.string(),
  contratadoNome: z.string(),
  contratadoDoc: z.string(),
  descricao: z.string(),
  valor: z.string(),
  pagamento: z.string(),
  prazo: z.string(),
  foro: z.string(),
});

export const createContract = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ form: formSchema }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabase
      .from("contracts")
      .insert({ form_data: data.form, status: "pending" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const getContract = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabase
      .from("contracts")
      .select("id, form_data, status, signer_name, signer_cpf, signer_ip, signed_at, created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const signContract = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().trim().min(3).max(150),
        cpf: z.string().trim().min(6).max(30),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    // Capturar IP do cliente
    let ip = "";
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? "";
    } catch {
      try {
        const req = getRequest();
        ip =
          req?.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
          req?.headers.get("cf-connecting-ip") ||
          req?.headers.get("x-real-ip") ||
          "";
      } catch {
        ip = "";
      }
    }

    const { data: existing, error: fetchErr } = await supabase
      .from("contracts")
      .select("status")
      .eq("id", data.id)
      .maybeSingle();
    if (fetchErr) throw new Error(fetchErr.message);
    if (!existing) throw new Error("Contrato não encontrado.");
    if (existing.status === "signed") {
      throw new Error("Este contrato já foi assinado.");
    }

    const signedAt = new Date().toISOString();
    const { error } = await supabase
      .from("contracts")
      .update({
        status: "signed",
        signer_name: data.name,
        signer_cpf: data.cpf,
        signer_ip: ip,
        signed_at: signedAt,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    return { ok: true, signed_at: signedAt, ip };
  });
