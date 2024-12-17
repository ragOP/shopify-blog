
    try {
      function sendLogToDb(event, userAgent, message, taboolaId, taboolaUserId, orderId = null, browserId = localStorage.getItem('taboola_browser_id')) {
        const userAgentEncode = encodeURIComponent(userAgent)
        let url = `https://spfy-pxl.taboola.com/save_log?event_name=${event}&user_agent=${userAgentEncode}&log_message=${message}&taboola_id=${taboolaId}&browser_id=${browserId}&taboola_user_id=${taboolaUserId}`
        if (orderId) {
          url += `&order_id=${orderId}`
        }
        fetch(url, {
          method: 'GET',
          keepalive: true
        });
      }
      function sendHttpEvent(query, taboolaId) {
        let tblciParam = localStorage.getItem('taboola global:tblci')
        const userIdParam = localStorage.getItem('taboola global:user-id')     
        const browserUrl = window.location.href
        const hash = window.location.hash
        const params = new URL(browserUrl).searchParams;
        const tblci = params.get('tblci');
        if (tblci) {
          tblciParam = tblci
          localStorage.setItem('taboola global:tblci', tblci)
          const existingKey = localStorage.getItem('taboola global:local-storage-keys')
          if (existingKey && JSON.parse(existingKey)[0] === 'taboola global:user-id') {
            localStorage.setItem('taboola global:local-storage-keys', JSON.stringify([...JSON.parse(existingKey), 'taboola global:tblci']))
          } else {
            localStorage.setItem('taboola global:local-storage-keys', JSON.stringify(['taboola global:tblci']))
          }
          localStorage.setItem('taboola global:last-external-referrer', 'taboola')
        } else {
          const paramPrefix = 'tblci'
          const paramIndex = hash.indexOf(paramPrefix);
          if (paramIndex !== -1) {
            const hashTblci = hash.slice(paramIndex + paramPrefix.length);
            if (hashTblci) {
              tblciParam = hashTblci
              localStorage.setItem('taboola global:tblci', tblciParam)
              const existingKey = localStorage.getItem('taboola global:local-storage-keys')
              if (existingKey && JSON.parse(existingKey)[0] === 'taboola global:user-id') {
                localStorage.setItem('taboola global:local-storage-keys', JSON.stringify([...JSON.parse(existingKey), 'taboola global:tblci']))
              } else {
                localStorage.setItem('taboola global:local-storage-keys', JSON.stringify(['taboola global:tblci']))
              }
              localStorage.setItem('taboola global:last-external-referrer', 'taboola')
            }
          }
        }
        if (tblciParam) {
          query += `&tblci=${tblciParam}`
        }
        if (userIdParam) {
          query += `&ui=${userIdParam}`
        }
        const itemUrl = `${document.location.origin}${document.location.pathname}`
        const url = `https://trc.taboola.com/${taboolaId}/log/3/unip?${query}&item-url=${encodeURIComponent(itemUrl)}`
        fetch(url, { method: 'GET', keepalive: true })
      }
      function createLocalStorageProxy() {
        const handler = {
            get(target, propKey, receiver) {
                const originalMethod = target[propKey];
                if (typeof originalMethod === 'function') {
                    return function(...args) {
                      if (propKey === 'setItem' && args[0] === 'add_to_cart' && true) {
                        sendLogToDb('add_to_cart', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[add_to_cart]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[add_to_cart]] tfa.push')
                        const cartLine = JSON.parse(args[1]).data.cartLine
                        _tfa.push({notify: 'event', name: 'add_to_cart', it: 'SHOPIFY_APP', id: 1716653, revenue: cartLine.cost.totalAmount.amount, currency: cartLine.cost.totalAmount.currencyCode, quantity: cartLine.quantity});
                        localStorage.removeItem('add_to_cart')
                        console.log('[TABOOLA DEBUG] - After [[add_to_cart]] tfa.push')
                        sendLogToDb('add_to_cart', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[add_to_cart]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')

                        sendLogToDb('add_to_cart', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[add_to_cart]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[add_to_cart]] http method')
                        const query = `en=add_to_cart_http&revenue=${cartLine.cost.totalAmount.amount}&currency=${cartLine.cost.totalAmount.currencyCode}&quantity=${cartLine.quantity}&it=SHOPIFY_APP`
                        sendHttpEvent(query ,1716653)
                        console.log('[TABOOLA DEBUG] - After [[add_to_cart]] http method')
                        sendLogToDb('add_to_cart', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[add_to_cart]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                      }
                      if (propKey === 'setItem' && args[0] === 'page_view' && true) {
                        _tfa.push({notify: 'event', name: 'page_view', it: 'SHOPIFY_APP', id: 1716653});
                        localStorage.removeItem('page_view');
                      }
                      if (propKey === 'setItem' && args[0] === 'purchase' && true) {
                        const logCheckout = JSON.parse(localStorage.getItem('purchase')).data.checkout;
                        const tabUserIdLog = localStorage.getItem('taboola global:user-id')
                        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[purchase]]', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
                        console.log('[TABOOLA DEBUG] - Before [[purchase]] tfa.push')
                        const checkout = JSON.parse(args[1]).data.checkout;
                        const quantity = checkout.lineItems.reduce((acc, obj) => acc + obj.quantity, 0)
                          _tfa.push({notify: 'event', name: 'make_purchase', it: 'SHOPIFY_APP', id: 1716653, revenue: checkout.totalPrice.amount, currency: checkout.currencyCode, orderid: checkout.order.id, quantity: quantity});
                        localStorage.removeItem('purchase')
                        console.log('[TABOOLA DEBUG] - After [[purchase]] tfa.push')
                        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[purchase]]', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)

                        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[purchase]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
                        console.log('[TABOOLA DEBUG] - Before [[purchase]] http method')
                        const query = `en=make_purchase_http&revenue=${checkout.totalPrice.amount}&currency=${checkout.currencyCode}&orderid=${checkout.order.id}&quantity=${quantity}&it=SHOPIFY_APP`
                        sendHttpEvent(query ,1716653)
                        console.log('[TABOOLA DEBUG] - After [[purchase]] http method')
                        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[purchase]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
                      }
                      if (propKey === 'setItem' && args[0] === 'cart_viewed' && true) {
                        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[cart_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[cart_viewed]] tfa.push')
                        _tfa.push({notify: 'event', name: 'cart_view', it: 'SHOPIFY_APP', id: 1716653});
                        localStorage.removeItem('cart_viewed')
                        console.log('[TABOOLA DEBUG] - After [[cart_viewed]] tfa.push')
                        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[cart_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')

                        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[cart_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[cart_viewed]] http method')
                        const query = `en=cart_view_http&it=SHOPIFY_APP`
                        sendHttpEvent(query ,1716653)
                        console.log('[TABOOLA DEBUG] - After [[cart_viewed]] http method')
                        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[cart_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                      }
                      if (propKey === 'setItem' && args[0] === 'search_submitted' && true) {
                        _tfa.push({notify: 'event', name: 'search_submitted', it: 'SHOPIFY_APP', id: 1716653});
                        localStorage.removeItem('search_submitted')
                      }
                      if (propKey === 'setItem' && args[0] === 'collection_viewed' && true) {
                        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[collection_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[collection_view]] tfa.push')
                        _tfa.push({notify: 'event', name: 'collection_view', it: 'SHOPIFY_APP', id: 1716653});
                        localStorage.removeItem('collection_viewed')
                        console.log('[TABOOLA DEBUG] - After [[collection_view]] tfa.push')
                        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[collection_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')

                        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[collection_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[collection_viewed]] http method')
                        const query = `en=collection_view_http&it=SHOPIFY_APP`
                        sendHttpEvent(query ,1716653)
                        console.log('[TABOOLA DEBUG] - After [[collection_viewed]] http method')
                        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[collection_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                      }
                      if (propKey === 'setItem' && args[0] === 'product_viewed' && true) {
                        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[product_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[product_view]] tfa.push')
                        _tfa.push({notify: 'event', name: 'product_view', it: 'SHOPIFY_APP', id: 1716653});
                        localStorage.removeItem('product_viewed')
                        console.log('[TABOOLA DEBUG] - After [[product_view]] tfa.push')
                        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[product_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')

                        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[product_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                        console.log('[TABOOLA DEBUG] - Before [[product_viewed]] http method')
                        const query = `en=product_view_http&it=SHOPIFY_APP`
                        sendHttpEvent(query ,1716653)
                        console.log('[TABOOLA DEBUG] - After [[product_viewed]] http method')
                        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[product_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
                      }
                      const result = originalMethod.apply(target, args);
                      return result;
                    };
                }
                return Reflect.get(target, propKey, receiver);
            }
        };
  
        return new Proxy(localStorage, handler);
      }
      const localStorageProxy = createLocalStorageProxy();
      Object.defineProperty(window, 'localStorage', { value: localStorageProxy, configurable: true, writable: true });
      try {
        localStorage.setItem('test', 'test'); // check if localStorage is open
        localStorage.removeItem('test'); // check if localStorage is open
        // open
      } catch (e) {
        sendLogToDb('local_storage', window.navigator.userAgent, '[TABOOLA DEBUG] - LocalStorage is blocked', '0f8fc81b-56e6-4759-a55b-577259185411'); // blocked
      }
  
      console.log('[TABOOLA DEBUG] - Loading tfa.js')
      window._tfa = window._tfa || [];
      !function (t, f, a, x) {
             if (!document.getElementById(x)) {
                t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
             }
      }(document.createElement('script'),
      document.getElementsByTagName('script')[0],
      '//cdn.taboola.com/libtrc/unip/1716653/tfa.js',
      'tb_tfa_script');
      console.log('[TABOOLA DEBUG] - tfa.js Loaded successfully')
      if (localStorage.getItem('taboola_browser_id')) {
        console.log('GOT BROWSER ID')
      } else {
        localStorage.setItem('taboola_browser_id', Math.floor(Math.random() * Math.floor(Math.random() * Date.now())))
      }
      if (localStorage.getItem('tb_id')) {
        localStorage.removeItem('tb_id')
      }
      localStorage.setItem('tb_id', 1716653)
      if (localStorage.getItem('pixel_allow_checkout_start')) {
        localStorage.removeItem('pixel_allow_checkout_start')
      }
      if (true) {
        localStorage.setItem('pixel_allow_checkout_start', true)
      } else {
        localStorage.removeItem('pixel_allow_checkout_start')
      }
      if (localStorage.getItem('add_to_cart') && true) {
        localStorage.removeItem('add_to_cart')
      }
      if (localStorage.getItem('page_view') && true) {
        console.log('[TABOOLA DEBUG] - Before [[page_view]] tfa.push')
        _tfa.push({notify: 'event', name: 'page_view', it: 'SHOPIFY_APP', id: 1716653});
        localStorage.removeItem('page_view');
        console.log('[TABOOLA DEBUG] - After [[page_view]] tfa.push')

        console.log('[SHOPIFY WEB PIXEL API HEALTH] - Page Viewed')
        sendLogToDb('page_view', window.navigator.userAgent, '[TABOOLA DEBUG] - HEALTH LOG [[page_view]]', '0f8fc81b-56e6-4759-a55b-577259185411')
      }
      if (localStorage.getItem('purchase') && true) {
        const logCheckout = JSON.parse(localStorage.getItem('purchase')).data.checkout;
        const tabUserIdLog = localStorage.getItem('taboola global:user-id')     
        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[purchase]]', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
        console.log('[TABOOLA DEBUG] - Before [[purchase]] tfa.push')
        const checkout = JSON.parse(localStorage.getItem('purchase')).data.checkout;
        const quantity = checkout.lineItems.reduce((acc, obj) => acc + obj.quantity, 0)
          _tfa.push({notify: 'event', name: 'make_purchase', it: 'SHOPIFY_APP', id: 1716653, revenue: checkout.totalPrice.amount, currency: checkout.currencyCode, orderid: checkout.order.id, quantity: quantity});
        localStorage.removeItem('purchase')
        console.log('[TABOOLA DEBUG] - After [[purchase]] tfa.push')
        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[purchase]]', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)

        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[purchase]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
        console.log('[TABOOLA DEBUG] - Before [[purchase]] http method')
        const query = `en=make_purchase_http&revenue=${checkout.totalPrice.amount}&currency=${checkout.currencyCode}&orderid=${checkout.order.id}&quantity=${quantity}&it=SHOPIFY_APP`
        sendHttpEvent(query ,1716653)
        console.log('[TABOOLA DEBUG] - After [[purchase]] http method')
        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[purchase]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
      }
      if (localStorage.getItem('purchase_tfa') && true) {
        const logCheckout = JSON.parse(localStorage.getItem('purchase_tfa')).data.checkout;
        const tabUserIdLog = localStorage.getItem('taboola global:user-id')     
        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[purchase]]', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
        console.log('[TABOOLA DEBUG] - Before [[purchase]] tfa.push')
        const checkout = JSON.parse(localStorage.getItem('purchase_tfa')).data.checkout;
        const quantity = checkout.lineItems.reduce((acc, obj) => acc + obj.quantity, 0)
          _tfa.push({notify: 'event', name: 'make_purchase_tfa', it: 'SHOPIFY_APP', id: 1716653, revenue: checkout.totalPrice.amount, currency: checkout.currencyCode, orderid: checkout.order.id, quantity: quantity});
        localStorage.removeItem('purchase_tfa')
        console.log('[TABOOLA DEBUG] - After [[purchase]] tfa.push')
        sendLogToDb('purchase', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[purchase]]', '0f8fc81b-56e6-4759-a55b-577259185411', tabUserIdLog, logCheckout.order.id)
      }
      if (localStorage.getItem('cart_viewed') && true) {
        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[cart_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')
        console.log('[TABOOLA DEBUG] - Before [[cart_viewed]] tfa.push')
        _tfa.push({notify: 'event', name: 'cart_view', it: 'SHOPIFY_APP', id: 1716653});
        localStorage.removeItem('cart_viewed')
        console.log('[TABOOLA DEBUG] - After [[cart_viewed]] tfa.push')
        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[cart_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')

        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[cart_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
        console.log('[TABOOLA DEBUG] - Before [[cart_viewed]] http method')
        const query = `en=cart_view_http&it=SHOPIFY_APP`
        sendHttpEvent(query ,1716653)
        console.log('[TABOOLA DEBUG] - After [[cart_viewed]] http method')
        sendLogToDb('cart_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[cart_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
      }
      if (localStorage.getItem('search_submitted') && true) {
        _tfa.push({notify: 'event', name: 'search_submitted', it: 'SHOPIFY_APP', id: 1716653});
        localStorage.removeItem('search_submitted')
      }
      if (localStorage.getItem('collection_viewed') && true) {
        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[collection_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')
        console.log('[TABOOLA DEBUG] - Before [[collection_view]] tfa.push')
        _tfa.push({notify: 'event', name: 'collection_view', it: 'SHOPIFY_APP', id: 1716653});
        localStorage.removeItem('collection_viewed')
        console.log('[TABOOLA DEBUG] - After [[collection_view]] tfa.push')
        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[collection_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')

        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[collection_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
        console.log('[TABOOLA DEBUG] - Before [[collection_viewed]] http method')
        const query = `en=collection_view_http&it=SHOPIFY_APP`
        sendHttpEvent(query ,1716653)
        console.log('[TABOOLA DEBUG] - After [[collection_viewed]] http method')
        sendLogToDb('collection_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[collection_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
      }
      if (localStorage.getItem('product_viewed') && true) {
        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[product_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')
        console.log('[TABOOLA DEBUG] - Before [[product_view]] tfa.push')
        _tfa.push({notify: 'event', name: 'product_view', it: 'SHOPIFY_APP', id: 1716653});
        localStorage.removeItem('product_viewed')
        console.log('[TABOOLA DEBUG] - After [[product_view]] tfa.push')
        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[product_viewed]]', '0f8fc81b-56e6-4759-a55b-577259185411', '')

        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - Before [[product_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
        console.log('[TABOOLA DEBUG] - Before [[product_viewed]] http method')
        const query = `en=product_view_http&it=SHOPIFY_APP`
        sendHttpEvent(query ,1716653)
        console.log('[TABOOLA DEBUG] - After [[product_viewed]] http method')
        sendLogToDb('product_viewed', window.navigator.userAgent, '[TABOOLA DEBUG] - After [[product_viewed]] http method', '0f8fc81b-56e6-4759-a55b-577259185411', '')
      }
    } catch (e) {
      console.log(e)
      console.log('[TABOOLA DEBUG] - Error occured on client script')
      sendLogToDb('client_script', window.navigator.userAgent, `[TABOOLA DEBUG] - Error occurred on client script: ${e.message}`, '0f8fc81b-56e6-4759-a55b-577259185411')
    }
    