(async () => {
  try {
    const { build } = require('vite')
    console.log('Invoking Vite build via Node API...')
    await build()
    console.log('Vite build completed')
  } catch (err) {
    console.error('Vite build failed:', err)
    process.exit(1)
  }
})()
