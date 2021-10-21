const debugSwRegistration = false

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

export function register(config) {
  debugSwRegistration && console.log('sw-debug', 'registering', config)
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    debugSwRegistration && console.log('sw-debug', 'can register')
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      debugSwRegistration && console.log('sw-debug', publicUrl.origin, 'is not', window.location.origin)
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      debugSwRegistration && console.log('sw-debug', 'load event')
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`
      debugSwRegistration && console.log('sw-debug', 'url is', swUrl)

      if (isLocalhost) {
        debugSwRegistration && console.log('sw-debug', 'is localhost')
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          debugSwRegistration && console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          )
        })
      } else {
        debugSwRegistration && console.log('sw-debug', 'registering regular service worker')
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config)
      }
    })
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      debugSwRegistration && console.log('sw-debug', 'registration done')
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          debugSwRegistration && console.log('sw-debug', 'installing worker is null')
          return
        }
        installingWorker.onstatechange = () => {
          debugSwRegistration && console.log('sw-debug', 'state changed')
          if (installingWorker.state === 'installed') {
            debugSwRegistration && console.log('sw-debug', 'installed worker')
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              debugSwRegistration && console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              )

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              debugSwRegistration && console.log('Content is cached for offline use.')

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error)
    })
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  debugSwRegistration && console.log('sw-debug', 'checking if sw is valid', swUrl, config)
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      debugSwRegistration && console.log('sw-debug', 'response to validating sw is', response.status)
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        debugSwRegistration && console.log('sw-debug', 'sw not found')
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        debugSwRegistration && console.log('sw-debug', 'sw is valid, proceed to install it')
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      debugSwRegistration && console.log('No internet connection found. App is running in offline mode.')
    })
}

export function unregister() {
  debugSwRegistration && console.log('sw-debug', 'unregistering')
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
