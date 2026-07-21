export type ContractType =
  | ""
  | "servicos_gerais"
  | "social_media"
  | "visita_imobiliaria"
  | "mentoria";

export const CONTRACT_LABELS: Record<Exclude<ContractType, "">, string> = {
  servicos_gerais: "Prestação de Serviços Gerais",
  social_media: "Social Media / Marketing",
  visita_imobiliaria: "Termo de Visita Imobiliária",
  mentoria: "Contrato de Mentoria / Consultoria",
};

export interface FormState {
  tipo: ContractType;
  contratanteNome: string;
  contratanteDoc: string;
  contratadoNome: string;
  contratadoDoc: string;
  descricao: string;
  valor: string;
  pagamento: string;
  prazo: string;
  foro: string;
}

export const initialForm: FormState = {
  tipo: "",
  contratanteNome: "",
  contratanteDoc: "",
  contratadoNome: "",
  contratadoDoc: "",
  descricao: "",
  valor: "",
  pagamento: "",
  prazo: "",
  foro: "",
};

function ph(v: string, fallback: string) {
  return v.trim() ? v : `[${fallback}]`;
}

export function buildContract(
  form: FormState,
): { title: string; paragraphs: string[] } | null {
  if (!form.tipo) return null;
  const title = `CONTRATO DE ${CONTRACT_LABELS[form.tipo].toUpperCase()}`;

  const contratante = `${ph(form.contratanteNome, "NOME DO CONTRATANTE")}, inscrito(a) no CPF/CNPJ sob nº ${ph(form.contratanteDoc, "CPF/CNPJ DO CONTRATANTE")}, doravante denominado(a) CONTRATANTE`;
  const contratado = `${ph(form.contratadoNome, "NOME DO CONTRATADO")}, inscrito(a) no CPF/CNPJ sob nº ${ph(form.contratadoDoc, "CPF/CNPJ DO CONTRATADO")}, doravante denominado(a) CONTRATADO`;

  const abertura = `Pelo presente instrumento particular, de um lado ${contratante}, e de outro lado ${contratado}, têm entre si justo e contratado o presente Contrato de ${CONTRACT_LABELS[form.tipo]}, que se regerá pelas cláusulas e condições a seguir:`;

  const objetoPorTipo: Record<Exclude<ContractType, "">, string> = {
    servicos_gerais: `O presente contrato tem por objeto a prestação, pelo CONTRATADO ao CONTRATANTE, dos seguintes serviços: ${ph(form.descricao, "DESCRIÇÃO DETALHADA DO SERVIÇO")}. Os serviços serão executados de forma autônoma, sem qualquer vínculo empregatício, observando padrões técnicos e boas práticas do mercado.`,
    social_media: `O presente contrato tem por objeto a prestação de serviços de gestão de mídias sociais e marketing digital, compreendendo: ${ph(form.descricao, "DESCRIÇÃO DAS ENTREGAS (posts, stories, campanhas, relatórios)")}. As entregas incluem criação de artes, redação de legendas, agendamento de publicações e acompanhamento de métricas, conforme escopo detalhado nesta cláusula.`,
    visita_imobiliaria: `O presente instrumento tem por objeto formalizar a visita técnica do CONTRATANTE ao imóvel descrito a seguir: ${ph(form.descricao, "ENDEREÇO E DESCRIÇÃO DO IMÓVEL")}, intermediada pelo CONTRATADO, para fins exclusivos de avaliação e eventual interesse em negociação.`,
    mentoria: `O presente contrato tem por objeto a prestação de serviços de mentoria/consultoria pelo CONTRATADO ao CONTRATANTE, com o seguinte escopo: ${ph(form.descricao, "TEMA, METODOLOGIA E ENTREGAS DA MENTORIA")}. As sessões possuem caráter consultivo e orientativo, não configurando garantia de resultado.`,
  };

  const clausulasEspecificas: Record<Exclude<ContractType, "">, string[]> = {
    servicos_gerais: [
      `CLÁUSULA QUARTA — DAS OBRIGAÇÕES`,
      `O CONTRATADO obriga-se a executar os serviços com zelo, técnica e dentro dos prazos estipulados, comunicando ao CONTRATANTE qualquer intercorrência que possa impactar a entrega. O CONTRATANTE obriga-se a efetuar os pagamentos nas condições acordadas e fornecer, em tempo hábil, todas as informações e materiais necessários à execução do objeto.`,
    ],
    social_media: [
      `CLÁUSULA QUARTA — DAS ENTREGAS E APROVAÇÃO DE ARTES`,
      `As artes, peças gráficas e conteúdos produzidos serão entregues ao CONTRATANTE em formato digital, por meio de plataforma de aprovação previamente combinada. O CONTRATANTE terá o prazo de até 3 (três) dias úteis para aprovar ou solicitar ajustes; a ausência de manifestação nesse prazo implicará aprovação tácita das peças.`,
      `CLÁUSULA QUINTA — DAS REFAÇÕES (ALTERAÇÕES DE LAYOUT)`,
      `Estão inclusas no valor deste contrato até 3 (três) alterações de layout por peça entregue (refações). Alterações adicionais, mudanças de conceito criativo já aprovado ou pedidos fora do escopo original serão cobrados à parte, mediante orçamento prévio.`,
      `CLÁUSULA SEXTA — DOS DIREITOS AUTORAIS E USO DE IMAGEM`,
      `Após a quitação integral deste contrato, o CONTRATADO cede ao CONTRATANTE os direitos de uso das artes e conteúdos entregues, para veiculação nas mídias sociais e canais de marketing do CONTRATANTE. Imagens de bancos licenciadas seguirão os termos da licença de origem. O CONTRATADO poderá utilizar as peças em seu portfólio profissional, salvo vedação expressa em contrário.`,
      `CLÁUSULA SÉTIMA — DA VERBA DE MÍDIA (ADS)`,
      `O valor pactuado neste contrato refere-se EXCLUSIVAMENTE à prestação de serviços de gestão, criação e planejamento. Não estão incluídos os investimentos em mídia paga (verba de anúncios) nas plataformas Meta (Facebook/Instagram), Google Ads, TikTok Ads ou quaisquer outras, cujos valores serão custeados diretamente pelo CONTRATANTE, em conta própria vinculada às respectivas plataformas.`,
    ],
    visita_imobiliaria: [
      `CLÁUSULA QUARTA — DAS OBRIGAÇÕES DAS PARTES`,
      `O CONTRATADO compromete-se a acompanhar o CONTRATANTE na visita, prestando informações verídicas sobre o imóvel. O CONTRATANTE declara ter tomado conhecimento do imóvel exclusivamente por intermédio do CONTRATADO e compromete-se a não negociar diretamente com o proprietário sem a devida intermediação, sob pena de responder pela comissão de corretagem.`,
    ],
    mentoria: [
      `CLÁUSULA QUARTA — DA METODOLOGIA E CONFIDENCIALIDADE`,
      `As sessões de mentoria serão realizadas de forma presencial ou remota, conforme cronograma acordado. Todo o material, método e informações compartilhadas são de caráter confidencial, sendo vedada sua reprodução, comercialização ou divulgação a terceiros sem autorização expressa do CONTRATADO.`,
      `CLÁUSULA QUINTA — DA AUSÊNCIA DE GARANTIA DE RESULTADO`,
      `O CONTRATADO compromete-se a empregar suas melhores técnicas e conhecimentos, sendo os resultados dependentes do engajamento, execução e contexto do CONTRATANTE. Não há, portanto, garantia de resultados financeiros ou de performance específicos.`,
    ],
  };

  const especificas = clausulasEspecificas[form.tipo];
  const nextIdx = 4 + especificas.length / 2;
  const ord = ["PRIMEIRA","SEGUNDA","TERCEIRA","QUARTA","QUINTA","SEXTA","SÉTIMA","OITAVA","NONA","DÉCIMA"];

  const paragraphs = [
    abertura,
    `CLÁUSULA PRIMEIRA — DO OBJETO`,
    objetoPorTipo[form.tipo],
    `CLÁUSULA SEGUNDA — DO VALOR E FORMA DE PAGAMENTO`,
    `Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${ph(form.valor, "VALOR")}, a ser pago na seguinte forma: ${ph(form.pagamento, "FORMA DE PAGAMENTO")}.`,
    `CLÁUSULA TERCEIRA — DO PRAZO`,
    `O presente contrato terá vigência / prazo de entrega de ${ph(form.prazo, "PRAZO DE ENTREGA OU VIGÊNCIA")}, contados a partir da assinatura deste instrumento.`,
    ...especificas,
    `CLÁUSULA ${ord[nextIdx - 1]} — DA RESCISÃO`,
    `O presente contrato poderá ser rescindido por qualquer das partes, mediante notificação prévia de 15 (quinze) dias, sem prejuízo da quitação dos serviços já prestados até a data da rescisão.`,
    `CLÁUSULA ${ord[nextIdx]} — DO FORO`,
    `Fica eleito o foro da comarca de ${ph(form.foro, "CIDADE")} para dirimir quaisquer dúvidas oriundas do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`,
    `E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor e forma.`,
    `${ph(form.foro, "CIDADE")}, ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}.`,
    `_______________________________________\n${ph(form.contratanteNome, "CONTRATANTE")}\nCONTRATANTE`,
    `_______________________________________\n${ph(form.contratadoNome, "CONTRATADO")}\nCONTRATADO`,
  ];

  return { title, paragraphs };
}
