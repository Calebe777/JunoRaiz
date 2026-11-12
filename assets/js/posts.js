/*
  POSTS DO BLOG DA JUNO
  =====================
  Para publicar um post novo, copie o bloco de exemplo abaixo (do "{" até o "},"),
  cole no TOPO da lista e troque os textos. O post mais novo aparece primeiro.

  Campos:
    slug ........ endereço do post (sem acento, sem espaço). Ex.: 'design-e-gestao'
                  fica em post.html?p=design-e-gestao
    date ........ data no formato ano-mês-dia. Ex.: '2026-11-10'
    category .... categoria curta. Ex.: 'Branding', 'Gestão', 'Bastidores'
    cover ....... imagem de capa (opcional). Coloque o arquivo em assets/img/blog/
                  e escreva o caminho. Ex.: 'assets/img/blog/minha-capa.webp'
                  Se não tiver capa, deixe ''.
    pt .......... título, resumo e texto em português
    en .......... (opcional) a mesma coisa em inglês. Se não existir, quem estiver
                  vendo o site em inglês lê a versão em português.

  Como formatar o texto (entre as crases ` `):
    Linha em branco ............ separa parágrafos
    ## Título .................. subtítulo
    ### Título ................. subtítulo menor
    **texto** .................. negrito
    *texto* .................... itálico
    > texto .................... citação em destaque
    - item ..................... lista
    1. item .................... lista numerada
    [texto](https://link) ...... link
    ![descrição](assets/img/blog/foto.webp) ... imagem
    --- ........................ linha divisória

  Atenção: não use crase ( ` ) dentro do texto, ela fecha o post.
*/
window.JUNO_POSTS = [
  {
    slug: 'post-de-exemplo',
    date: '2026-11-10',
    category: 'Bastidores',
    cover: '',
    pt: {
      title: 'Post de exemplo: o blog da JUNO chegou',
      excerpt: 'Este é um modelo pra mostrar como os posts ficam. Troque este texto pela sua primeira opinião ou ideia.',
      body: `
Este é um post de exemplo. Ele existe só pra mostrar como o blog fica com um texto de verdade, então pode apagar ou reescrever quando for publicar o primeiro post.

O blog da JUNO é o lugar pra compartilhar opiniões e ideias sobre marca, design e gestão. Sem fórmula pronta: o que a gente pensa, testa e aprende no dia a dia do estúdio.

## Um subtítulo pra organizar o texto

Textos longos ficam mais fáceis de ler quando são divididos em partes. Use subtítulos sempre que mudar de assunto. Dá pra deixar uma palavra em **negrito** ou em *itálico* quando ela precisa de destaque.

> Uma frase forte pode virar citação e ganhar destaque no meio do texto.

## Listas também funcionam

- Primeiro ponto da lista
- Segundo ponto, com um [link de exemplo](https://www.instagram.com/junojpeg)
- Terceiro ponto

1. Passo um
2. Passo dois
3. Passo três

---

No fim de cada post aparecem os botões pra compartilhar no WhatsApp e no LinkedIn, e um convite pra conversar com a JUNO.
`
    }
  }
];
