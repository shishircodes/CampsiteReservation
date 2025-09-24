import nextMDX from '@next/mdx'

const withMDX = nextMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins:[]
    }
})

const nextConfig = {
    pageExtensions: ['ts','tsx','js','jsx','md','mdx'],
}

export default withMDX(nextConfig)
