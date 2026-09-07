<div align="center">
  <img src="assets/icons/favicon.svg" width="88" height="88" alt="Símbolo de THERAN">
  <h1>THERAN</h1>
  <p><strong>Site oficial do universo de ficção científica criado por Noah Keller.</strong></p>
  <p>
    <a href="https://nkellermc.github.io/">Acessar o site</a>
    ·
    <a href="https://nkellermc.github.io/amostra">Ler a amostra</a>
  </p>
</div>

---

## Sobre o projeto

Este repositório reúne a experiência digital de **THERAN**: uma SPA narrativa com páginas sobre a história, o mundo, os personagens, o livro e seus arquivos. A seção interativa permite explorar o celular de James e seus aplicativos — Ariq, Orin, Notas, Threadly e Riva — sem interromper a navegação principal.

O conteúdo em português e inglês é escolhido automaticamente de acordo com o idioma do navegador.

## Experiência

- Navegação SPA, sem recarregamentos entre páginas.
- Interface responsiva para celular, tablet e computador.
- Celular interativo de James com aplicativos e conversas narrativas.
- Threadly como rede social ficcional, com 100 publicações ancoradas na amostra do EPUB e dois clipes originais de motion design.
- Riva como publicação jornalística cotidiana de Theran, com símbolo vetorial e paleta editorial próprios.
- Leitor de amostra integrado em português e inglês.
- Rotas diretas compatíveis com GitHub Pages.

## Tecnologias

- **React 19** para a interface e o ciclo de vida das páginas.
- **TypeScript** para tipagem e manutenção do código.
- **Vite 8** para desenvolvimento e geração do site estático.
- **HTML, CSS, JavaScript e SVG** para a identidade visual e as interações.
- **GitHub Actions** para publicação automática no GitHub Pages.

## Executar localmente

É necessário ter o [Node.js 24](https://nodejs.org/) instalado.

```bash
git clone https://github.com/NKellerMC/NKellerMC.github.io.git
cd NKellerMC.github.io
npm ci
npm run dev
```

O Vite mostrará no terminal o endereço local do projeto.

## Comandos

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run typecheck` | Verifica os tipos TypeScript sem gerar arquivos. |
| `npm run build` | Valida o código e gera a versão de produção em `dist/`. |
| `npm run preview` | Abre localmente a versão já construída. |

## Estrutura

```text
.
├── assets/                 # Arte, ícones, estilos, scripts e amostras
├── bibi-bookshelf/         # Conteúdo das amostras do livro
├── bibi-v716/              # Leitor EPUB integrado
├── src/
│   ├── app/                # Rotas e componentes React
│   ├── content/pages/      # Conteúdo das páginas em PT-BR e EN-US
│   └── runtime/            # Integração dos módulos narrativos
├── index.html              # Entrada da aplicação
└── vite.config.ts          # Build e geração das rotas estáticas
```

## Publicação

Cada atualização enviada para a branch `main` executa automaticamente:

1. instalação reproduzível das dependências;
2. verificação do TypeScript;
3. build de produção com Vite;
4. publicação da pasta `dist/` no GitHub Pages.

O workflow está em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Conteúdo e direitos

O site, o universo, a narrativa, os personagens, os EPUBs, o celular de James e os aplicativos Ariq, Orin, Notas, Threadly e Riva são conteúdos proprietários de Noah Keller. Consulte a [licença do projeto](LICENSE.md) para conhecer os termos completos.

Dependências de terceiros permanecem sob suas próprias licenças; a licença do leitor Bibi está disponível em [`licenses/Bibi-MIT.txt`](licenses/Bibi-MIT.txt).

---

<div align="center">
  <sub>THERAN — todos os direitos reservados.</sub>
</div>
