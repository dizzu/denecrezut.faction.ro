chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            jQuery.expr[":"].icontains = jQuery.expr.createPseudo(function (arg) {
                return function (elem) {
                    var found = jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) == 0;
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
                'criterii.ro',
                'reporteronline.net',
                'lupuldacicblogg.wordpress.com',
                'incorect.org',
                'ro.blastingnews.com',
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
                'exclusivenews.ro',
                'infopuls.ro',
                'invectiva.ro',
                'explozivnews24.ro',
                'alternativenews.ro',
                'exclusiv24.ro',
                'STIRI.ROL.RO',
                'rol.ro',
                'grupul.ro',
                'stiripesurse.ro',
                'romaniatv.net',
                'antena3.ro',
                'curentul.info',
                'justitiarul.ro',
                'sibiu.justitiarul.ro',
                'certitudinea.ro',
                'stiri.rol.ro',
                'dcnews.ro',
                'rdo.ro',
                'bzi.ro',
                'VIATASANATOASA.BIZ',
                'VEZI.BIZ',
                'krespy-ro.com',
                'DORCALATOR.BIZ',
                'ROMANI-BUNI.INFO',
                'ROMANIASTAR.RO',
                'romaniaa.ro',
                'STIRIREALE.BIZ',
                'STIRIREALE.INFO',
                'ROMANUL.CO.UK',
                'EXTRANEWS.RO',
                'FRIP.RO',
                'SOFERI.BIZ',
                'CLICKPOLITIC.RO',
                'DANANDRONIC.NET',
                'FRUMUSETILEROMANIEI.BIZ',
                'LOON.RO',
                'POVESTEA.ME',
                'RADIOROCO.INFO',
                'chestii.net',
                'ZZE.RO',
                'ANTENA1HOTNEWS.BIZ',
                'BUNAZIUA.INFO',
                'NEBUNATICA.NET',
                'NUMAI.TOP',
                'STIRIONLINE24.PW',
                'STIRIONLINE19.PW',
                'STIREA9.PW',
                'IUBESCROMANIA.BIZ',
                'ASTAZI.BIZ',
                'stiri24ore.ro',
                'stirideultimaora.net',
                'socialistul.com',
                'exclusivitate.org'
            ];

            var didScroll = false;
            var processing = false;
            var stop = false;

            var badLink = '';
            var badLinks = links.map(function(link) {
                var badLink = 'div.mtm div:icontains("'+link+'").ellipsis';
                return badLink;
            }).join();

            var access_token = '';
            var current_fb_id = '';
            var fb_dtsg = '';

             var debug = 0;
            if (window.location.href.match(/#debug/)) {
                debug = 1;
            }

            function linkWarning() {
                processing = true;
                if (window.location.hostname=='www.facebook.com') {
                    fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
                    var badLinksObjects = $(badLinks);
                    for (var i = 0, len = badLinksObjects.length; i < len; i++) {
                        if ($(badLinksObjects[i]).parent().hasClass("_42ef")) {
                            $(badLinksObjects[i]).parent().parent().parent().removeClass('clearfix').addClass('hint--error hint--large hint--bottom-right fakenews');
                            $(badLinksObjects[i]).parent().parent().parent().attr('aria-label', 'Pare de necrezut? Verifica informatia si din alte surse.');
                        }
                        else {
                            $(badLinksObjects[i]).parent().addClass('hint--error hint--large hint--top-right fakenews hint-left');
                            $(badLinksObjects[i]).parent().attr('aria-label', 'Pare de necrezut? Verifica informatia si din alte surse.');
                        }
                    }
                }
                else {
                    if (links.indexOf(window.location.hostname.replace('www.', ''))!=-1) {
                        $("body").append("<div class='hint--error hint--large hint--align-center hint--top hint--red hint--bounce fakenews' style='position: fixed; width: 100%; left: -50%; text-align: center; z-index: 99999999; top: 35px;' aria-label='Cercetează înainte să crezi! Verifică informația și din alte surse.'></div><style>.hint--error::before { display: none; } .hint--large::after { width: 100% !important; font-weight: bold; }</style>");
                    }
                    stop = true;
                }
                processing = false;
            };

            function doThisStuffOnScroll() {
                didScroll = true;
            }

            function getURLParameter(parameter_name, page_url) {
                var split_page_url = page_url.split('?')[1];
                if (split_page_url == null) {
                    return;
                }

                var url_variables = split_page_url.split('&');

                for (var i = 0; i < url_variables.length; i++) {
                    var current_parameter_name = url_variables[i].split('=');
                    if (current_parameter_name[0] == parameter_name) {
                        return decodeURIComponent(current_parameter_name[1]);
                    }
                }
            }

            // this function gets the facebook id for the current user so that we can know who reported the fake news (as described in the privacy policy).
            function get_current_fb_id() {
                if (debug) {
                    console.trace();
                }
                var userid = '';
                try {
                    userid = document.cookie.match(/c_user=(\d+)/)[1];
                } catch (e) {
                    console.log('problem getting logged in user id: ' + e);
                }
                if (debug) {
                    console.log("userid= " + userid);
                }
                return userid;
            }

            linkWarning();

            document.addEventListener('scroll', doThisStuffOnScroll);

            setInterval(function() {
                $("ul.uiList a:not(.marked)[ajaxify*='MARK_AS_FALSE_NEWS']").unbind().one("click", function() {
                    $(this).addClass('marked');
                    var href = decodeURI($(this).attr('ajaxify'));
                    var json_params = JSON.parse(getURLParameter('context', href));
                    if (typeof json_params.story_permalink_token != "undefined") {
                        var array = json_params.story_permalink_token.split(':');
                        var fb_id = array[2];
                    }
                    else {
                        var fb_id = json_params.reportable_ent_token;
                    }

                    current_fb_id = get_current_fb_id();
                    if (fb_id) {
                        var data_to_send = {
                            story_id: fb_id,
                            user_id: current_fb_id
                        };

                        $.post('https://report.faction.ro/report.php', data_to_send, function(data) {
                            data = JSON.parse(data);
                            if (debug) {
                                if (data.status==1) {
                                    console.log('%c Data successfully saved also on the De Necrezut website.', 'background: green; color: white;');
                                }
                                else {
                                    console.log('%c There was a problem saving the data on the De Necrezut website.', 'background: red; color: white;');
                                }
                            }
                        });
                    }

                });
            }, 500);

            setInterval(function() {
                if(didScroll && !processing && !stop) {
                    didScroll = false;
                    linkWarning();
                }
            }, 2500);
        }
    }, 10);
});
