import autoLaunch from 'auto-launch'

const launcher = new autoLaunch({
  name: 'wallpaper',
  isHidden: true
})

async function setAutoLaunch (isAutoLaunch) {
    const tupe = isAutoLaunch ? 'enable' : 'disable'
    const result = await launcher[tupe]()
    return result
}
export { setAutoLaunch }