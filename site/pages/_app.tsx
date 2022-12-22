import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'
import TrackerProvider, { TrackerContext } from '../context/trackerProvider'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import trackerRedux from '@openreplay/tracker-redux'

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

  const plugins = [
    {
      name: 'redux',
      fn: trackerRedux,
    },
  ]

  return (
    <TrackerProvider config={{ plugins, __DISABLE_SECURE_MODE: true }}>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </TrackerProvider>
  )
}
