import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'
import TrackerProvider from '../context/trackerProvider'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import trackerAxios from '@openreplay/tracker-axios/cjs'
import { Provider } from 'react-redux'
import store from '../store/store'

const Noop: FC = ({ children }) => <>{children}</>

interface RequestData {
  body: BodyInit | null | undefined // whatewer you've put in the init.body in fetch(url, init)
  headers: Record<string, string>
}
interface ResponseData {
  body: string | Object | null // Object if response is of JSON type
  headers: Record<string, string>
}
interface RequestResponseData {
  readonly status: number
  readonly method: string
  url: string
  request: RequestData
  response: ResponseData
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  let plugins = [
    {
      fn: trackerAxios,
      config: {
        failuresOnly: false,
        sanitiser: (data: RequestResponseData) => {
          data.url = data.url.replace(/apiKey=([0-9a-z]+)/, 'apiKey=XXXXXX')
          return data
        },
      },
    },
  ]

  return (
    <Provider store={store}>
      <TrackerProvider config={{ plugins }}>
        <Head />
        <ManagedUIContext>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ManagedUIContext>
      </TrackerProvider>
    </Provider>
  )
}
