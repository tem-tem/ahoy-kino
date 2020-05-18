import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  // background: black;
  // linear-gradient(90deg, black (100px - 1px), transparent 1%) center,
  // linear-gradient(black (99px - 1px), transparent 1%) center,
  // white;
  // background-size: 100px 100px;
  render() {
    return (
      <Html>
        <Head />
        <style>{`
          body {
            background:
              linear-gradient(90deg, #0e0e0e 99px, transparent 1%) center,
              linear-gradient(#0e0e0e 99px, transparent 1%) center,
              #7b7b7b;
            background-size: 100px 100px;
          }
        `}</style>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
