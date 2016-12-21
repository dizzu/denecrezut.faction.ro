chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            jQuery.expr[":"].icontains = jQuery.expr.createPseudo(function (arg) {
                return function (elem) {
                    var found = jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                    if (jQuery(elem).hasClass('fakenews')) { 
                        return false;
                    }
                    if (found) {
                        jQuery(elem).addClass('fakenews');
                    }
                    return found;
                };
            });

            var supportsPassive = eventListenerOptionsSupported();

            if (supportsPassive) {
                var addEvent = EventTarget.prototype.addEventListener;
                overwriteAddEvent(addEvent);
            }

            function overwriteAddEvent(superMethod) {
                var defaultOptions = {
                    passive: true,
                    capture: false
                };

                EventTarget.prototype.addEventListener = function(type, listener, options) {
                    var usesListenerOptions = typeof options === 'object';
                    var useCapture = usesListenerOptions ? options.capture : options;

                    options = usesListenerOptions ? options : {};
                    options.passive = options.passive !== undefined ? options.passive : defaultOptions.passive;
                    options.capture = useCapture !== undefined ? useCapture : defaultOptions.capture;

                    superMethod.call(this, type, listener, options);
                };
            }

            function eventListenerOptionsSupported() {
                var sopported = false;
                try {
                      var opts = Object.defineProperty({}, 'passive', {
                            get: function() {
                                sopported = true;
                            }
                      });
                      window.addEventListener("test", null, opts);
                } catch (e) {}

                return sopported;
            }

            clearInterval(readyStateCheckInterval);

            var links = [
                'cocoon.ro',
                'fluierul.ro',
                'vremuritulburi.com',
                'nedreptate.net',
                'expunere.com',
                'descrieri.ro',
                'cunoastelumea.ro',
                'activenews.ro',
                'aflasitu.ro',
                'infoAlert.ro',
                'cyd.ro',
                'efemeride.ro',
                'nationalisti.ro',
                'nasul.ro',
                'nuv.ro',
                'social-media-romania.eu',
                'searchnewsglobal.wordpress.com',
                'lovendal.ro',
                'ziaristionline.ro',
                'yno.ro',
                'caplimpede.ro',
                'secretele.com',
                'napocanews.ro',
                'stirinefiltrate.ro',
                'dzr.org.ro',
                'stiri-extreme.ro',
                'ro.blastingnews.com',
                'onlinereport.ro',
                'obiectiv.info',
                'dailynewsro.com',
                'soim.ro',
                'gandeste.org',
                'recentnews.ro',
                'eufrosin.wordpress.com',
                'criterii.ro',
                'reporteronline.net',
                'lupuldacicblogg.wordpress.com',
                'incorect.org',
                'ro.blastingnews.com',
                'inliniedreapta.net',
                'inliniedreapta.ro',
                'stireazilei.com',
                'flux24.ro',
                'deretinut.net',
                'ziaruldegarda.ro',
                'presalibera.net',
                'teinformam.ro',
                'perfectmedia.tv',
                'stiriblana.pw',
                'impactpress.ro',
                'us24.ro',
                'sokant.ro',
                'comunitatea.stampenet.com',
                'stirea.ru',
                'oliviasteer.ro',
                'comisarul.ro',
                'luju.ro',
                'psnews.ro',
                'exclusivenews.ro',
                'infopuls.ro',
                'invectiva.ro',
                'explozivnews24.ro',
                'alternativenews.ro',
                'exclusiv24.ro'
            ];

            var didScroll = false;
            var processing = false;
            var stop = false;

            var badLink = '';
            var badLinks = links.map(function(link) {
                var badLink = 'div.mtm div:icontains("'+link+'").ellipsis';
                return badLink;
            }).join();

            function linkWarning() {
                processing = true;
                if (window.location.hostname=='www.facebook.com') {
                    var badLinksObjects = $(badLinks);
                    for (var i = 0, len = badLinksObjects.length; i < len; i++) {
                        console.log($(badLinksObjects[i]).attr('class'));
                        if ($(badLinksObjects[i]).parent().hasClass("_42ef")) {
                            $(badLinksObjects[i]).parent().parent().parent().removeClass('clearfix').addClass('hint--error hint--large hint--bottom-right fakenews');
                            $(badLinksObjects[i]).parent().parent().parent().attr('aria-label', 'Acest site nu este o sursa sigura de informare.');
                        }
                        else {
                            $(badLinksObjects[i]).parent().addClass('hint--error hint--large hint--top-right fakenews');
                            $(badLinksObjects[i]).parent().attr('aria-label', 'Acest site nu este o sursa sigura de informare.');
                        }
                    }
                }
                else {
                    if (links.indexOf(window.location.hostname.replace('www.', ''))!=-1) {
                        $("body").append("<div class='hint--error hint--large hint--align-center hint--top hint--red hint--bounce fakenews' style='position: fixed; width: 100%; left: -240px; text-align: center; z-index: 99999999; bottom: 0px;' aria-label='Acest site nu este considerat o sursa sigura de informare.'></div><style>.hint--error::before { display: none; }</style>");
                    }
                    stop = true;
                }
                processing = false;
            };

            linkWarning();

            document.addEventListener('scroll', doThisStuffOnScroll);

            function doThisStuffOnScroll() {
                didScroll = true;
            }

            setInterval(function() {
                if(didScroll && !processing && !stop) {
                    didScroll = false;
                    linkWarning();
                }
            }, 2500);
        }
    }, 10);
});
