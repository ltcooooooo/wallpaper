import autoLaunch from 'auto-launch'

const launcher = new autoLaunch({
  name: 'wallpaper',
  isHidden: true
})

async function setAutoLaunch (isAutoLaunch) {
    const type = isAutoLaunch ? 'enable' : 'disable'
    const result = await launcher[type]()
    return result
}
export { setAutoLaunch }