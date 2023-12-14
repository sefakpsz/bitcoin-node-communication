export const envSelector = (network: string) => {
    let url
    let passphrase
    switch (network) {
        case 'test':
            url = process.env.testurl as string
            passphrase = process.env.testpassphrase as string
            break
        case 'main':
            url = process.env.mainurl as string
            passphrase = process.env.mainpassphrase as string
            break
        default:
            url = null
    }

    return { url, passphrase }
}