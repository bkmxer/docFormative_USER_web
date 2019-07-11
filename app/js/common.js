var loadOverlayHtml = '<div class="tile__overlay tile__overlay--opacity hide"><div id="c"><div class="s"></div></div></div>'

function customFileUpload() {

    var wrapper = $(".file_upload"),
        inp = wrapper.find("input"),
        btn = wrapper.find("button"),
        lbl = wrapper.find("div");

    btn.focus(function() {
        inp.focus()
    });

    // Crutches for the :focus style:
    inp.focus(function() {
        wrapper.addClass("focus");
    }).blur(function() {
        wrapper.removeClass("focus");
    });

    // Yep, it works!
    btn.add(lbl).click(function() {
        inp.click();
    });


    // Crutches for the :focus style:
    btn.focus(function() {
        wrapper.addClass("focus");
    }).blur(function() {
        wrapper.removeClass("focus");
    });


    var file_api = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;

    inp.change(function() {
        var file_name;

        if (file_api && inp[0].files[0])
            file_name = inp[0].files[0].name;
        else
            file_name = inp.val().replace("C:\\fakepath\\", '');

        if (!file_name.length)
            return;

        if (lbl.is(":visible")) {
            lbl.removeClass('visually-hidden').text(file_name);
            btn.find('span').text("Attach");
        } else {
            btn.find('span').text(file_name);
        }
    }).change();

    $(window).resize(function() {
        $(".file_upload input").triggerHandler("change");
    });
}

  
// function to init profile events
function initProfileEvents() {
    $('#profile-form').change(function(e) {
        e.preventDefault();
        var $inputs = $(this).find('.button[disabled]');
        $inputs.removeAttr('disabled');
    })
}

//function to init Search Form events
function initSeachFormEvents() {
    $('.js-search-form__reset').on('click', function(){
        $(this).closest('form').trigger("reset");
        $(this).addClass('hide');
        $('.section--search').addClass('hide');
    })

    $('.js-search-form__input').on('input change', function(){
        if ($(this).val()) {
            $(this).closest('form').find('.js-search-form__reset').removeClass('hide');
            //to be wrapped with a function
            $('.section--search').removeClass('hide');
            $('.section--search .search__request').html($(this).val());
        } else {
            $(this).closest('form').find('.js-search-form__reset').addClass('hide');
            $('.section--search').addClass('hide');
        }
    })

    $('.js-search-section__mobile-trigger').on('click', function(){
        $(this).toggleClass('search-section__mobile-trigger--active');
        $(this).closest('.search-section').toggleClass('search-section--active');
    })

    //simulation to show the functionality
    $('#companies-search').on('submit', function(e) {
        e.preventDefault();
        $('.section--search').removeClass('hide');
    })

    $('.js-search__filter').on('click', function(){
        $(this).toggleClass('search__filter--active');
    })
}

//function to add a loading overlay
function addLoadingOverlay($el) {
    $el.children('.tile__overlay').remove();
    $el.append(loadOverlayHtml);
    if ($el.css('position') == 'static') {
        $el.addClass('tile__overlay--relative');
    }
    $el.children('.tile__overlay').removeClass('hide tile__overlay--opacity');
}

//function to remove a loading overlay
function removeLoadingOverlay($el) {
    $el.children('.tile__overlay').addClass('tile__overlay--opacity');
}

// function to show the pop-up's
function initPopup() {
    $('.js-show-popup').each(function(index, element) {
        $(element).popup({
            popup      : $('#' + $(this).data('popup')),
            position   : 'bottom center',
            on         : 'click'
        }) 
    });
}

// function to show the pop-up's
function initModal() {
    $('.js-show-modal').on('click', function(){
            var modalId = $(this).data('modal');
            $('#' + modalId).modal('show');
    });
}

//function to capitalize the first letter of the string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//function to simulate the search behavior 
function simulateSearch() {
    var $searchField = $('#Search');
    var $chatGroups = $('.chats__group');
    var $chatGroupItems = $('.chats__group-item');
    var searchText = "";

    $searchField.on('input change', function() {

        //check if the field is not empty
        if ($(this).val() != "" && $chatGroupItems.length) {
            searchText = $(this).val();

            $chatGroupItems.addClass('hide');
            $chatGroupItems.each(function(index, element) {
                if ($(element).text().toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
                    console.log('element: ', index);
                    $(element).closest('.chats__group').removeClass('hide');
                    $(element).removeClass('hide');
                }
            })
        } else {
            $chatGroups.removeClass('hide');
            $chatGroupItems.removeClass('hide')
        }
    })
}

//function to switch active dialog
function switchLinks() {
    var $groupLinks = $('.chats__group-link');
    var $chats = $('.chat');

    $groupLinks.on('click', function(e) {
        e.preventDefault();
        $groupLinks.removeClass('chats__group-link--active');
        $(this).addClass('chats__group-link--active');
        $chats.addClass('hide');
        
        if ($(this).data('dialog')) {
            $('.dialog-wrapper').addClass('hide');
            $('.dialog-wrapper[data-dialog="' + $(this).data('dialog') + '"]').removeClass('hide');
            $('.dialog__list').removeClass('dialog__list--active');
        }
    })
}

function initEvents() {

    $(document).on('input change focusout', 'input, .input, select, .select', function(){
        $(this).siblings('.input__error').addClass('fade-out');

        if ($(this).val()) {
            $(this).addClass('not-empty');
            $(this).siblings('.input__info').removeClass('fade-out');
        } else {
            $(this).removeClass('not-empty');
            $(this).siblings('.input__info').addClass('fade-out');
        }
    })

    $('.burger-menu').click(function(){
        $(this).toggleClass('burger-menu--open');
        $('.navigation__sidebar').toggleClass('navigation__sidebar--active-mobile');
    });

    $('.js-open-dialogs').click(function(){
        $('.dialog__list').toggleClass('dialog__list--active');
    });

    $(document).on('click', '.js-like', function(){
        var activeStatus = 'YES';
        var item_type = $('body').attr('id');
        // console.log(item_type);
        
        if ($(this).hasClass('like--active')) {
            activeStatus = 'NO';
        }

        $(this).toggleClass('like--active');
        
        // console.log(activeStatus);

        $.ajax({
            type: 'GET',
            data: {
                'token' : getCookie('access_token'),
                'TYPE' : 'MARK_FAVORITE',
                'item_id' : localStorage.getItem('active' + capitalizeFirstLetter(item_type)),
                'favorite_status' : activeStatus,
                'item_type' : item_type
            },
            url: 'https://api.docformative.com/favorites.php',
            contentType: 'text/plain',
            success: function(data) {
                if (data.SUCCESS === "YES") {
                    console.log(data);
                } else {
                    console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                }
            },
            
            error: function(data) {
                console.warn('Error while sending the ajax request');
            }
        });
    });
    
    initSeachFormEvents();

    initPopup();
    initModal();

    switchLinks();
    simulateSearch();

    initProfileEvents()

    // simulation of message chat sending behavior
    $('.js-chat-send').on('click submit', function(e) {
        e.preventDefault();
        var $form = $(this).closest('form');
        var message = $form.find('.message-input__inputfield').val();
        if (message && message != "") {
            $form.siblings('.dialog-wrapper:not(.hide)').find('.dialog__main').prepend('<div class="message message--left"><div class="message__img"><img src="img/dialogs/chat-1.jpg" alt=""></div><p class="message__text">' + message + '</p></div>');
            $form.find('.message-input__inputfield').val('');
        }
    })

    $(document).on('click', '.js-news-link', function(e){
        e.preventDefault();

        if ($(this).hasClass('company-link')) {
            var companyId = $(this).data('id');
            localStorage.setItem('activeCompany', companyId);
        } else if ($(this).hasClass('product-link')) {
            var productId = $(this).data('id');
            localStorage.setItem('activeProduct', productId);
        } else {
            var newsId = $(this).data('id');
            localStorage.setItem('activeNews', newsId);
        }

        window.location.href = $(this).attr('href');
    })

    //logout process
    $('.js-logout').on('click', function(e){
        e.preventDefault();

        $.ajax({
            type: 'GET',
            data: {
                'TYPE'  : 'LOGOUT',
                'token' : getCookie('access_token')
            },
            url: 'https://api.docformative.com/auth.php',
            contentType: 'text/plain',
            success: function(data) {
                if (data.SUCCESS === "YES") {
                    document.cookie='access_token='+data.MESSAGE.token;
                    deleteCookie('access_token');
                    deleteCookie('NPI_number');
                    console.info('success! \n token: ', getCookie('access_token'));
                    console.log(data);
                    location.href = '/login.html';
                } else {
                    console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                }
            },

            error: function(data) {
                console.warn('Error while trying to logout');
            }
        });
    })

}

// function convertinag the array of objects to the object
function convertArrayToOjbject(arr) {
    var result = {};

    for (var i=0; i<arr.length; i++) {
        result[arr[i].name] = arr[i].value;
    }

    return result;
}

// returns cookie with the field name, if that exists, else, returns undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// function to set cookie
// Arguments: 
// name - cookie name
// value - value string
// options - additional options for the cookie set-up
//     - expires - Cookie expiration time
//     - path - Path for the cookie
//     - domain - Domain for the cookie to work within
//     - secure - if TRUE - https only
function setCookie(name, value, options) {
    options = options || {};
  
    var expires = options.expires;
  
    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }
  
    value = encodeURIComponent(value);
  
    var updatedCookie = name + "=" + value;
  
    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }
  
    document.cookie = updatedCookie;
}

//function to delete cookie, setting the date in the past
function deleteCookie(name) {
    setCookie(name, "", {
      expires: -1
    })
}

function formatFavData(picUrl, nameText, url, specificClassName){
    var pic = picUrl && picUrl.length ? picUrl : './img/news/color-5.svg'; // if company/name/news pic is not set up - use the placehold
    var nameVar = nameText && nameText.length ? nameText : '';
    var url = url && url.length ? url : './news-article.html'; 
    var specificClass = specificClassName ? specificClassName : ''; 
    console.log(specificClassName);

    if (nameVar && nameVar.length) {
        var urlParam = '-id=';
        var dataID; 
        if (url.indexOf(urlParam) >= 0) {
            dataID = url.substr(url.indexOf(urlParam) + urlParam.length)
        } else {
            dataID = '';
        }
        return '<a href="' + url + '" class="tile tile--small js-news-link ' + specificClass + '" data-id="' + dataID + '"><img src="' + pic + '" alt="' + nameVar + '"><p class="tile__description line-1">'+ nameVar + '</p></a>';
    }
}

function formatNewsData(picUrl, name, newsID){
    var pic = picUrl && picUrl.length ? picUrl : './img/news/color-2.svg'; // if company/name/news pic is not set up - use the placehold
    var nameVar = name && name.length ? name : '';
    var id = newsID && newsID.length ? newsID : './news-article.html'; 

    if (nameVar && nameVar.length) {
        return '<a href="./news-article.html?news-id=' + id + '" data-id="' + id + '" class="tile tile--news js-news-link"><img src="' + pic + '" alt="' + nameVar + '"><p class="tile__description line-1">' + nameVar + '</p></a>';
    }
}

// Utils to differentiate the code fired for different pages
UTIL = { 
    fire : function(func,funcname, args){
        var namespace = docFormative;  // indicate your obj literal namespace here

        funcname = (funcname === undefined) ? 'init' : funcname;
        if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
            namespace[func][funcname](args);
        }
    }, 
  
    loadEvents : function(){
        var bodyId = document.body.id;

        // hit up common first.
        UTIL.fire('common');

        // do all the classes too.
        UTIL.fire(bodyId);

        UTIL.fire('common','finalize');
    }
  };

docFormative = {
    common : {
        init : function(){
            initEvents();
        },
        finalize : function(){
          
        }
    },

    profile : {
      init : function(){
            console.log('%c profile page only', 'color: green;');
            $.ajax({
                type: 'GET',
                // data: {"TYPE":"GET_TK",
                // "username":"john@gmail.com",
                // "password":"Altavista"},
                data: {
                    'TYPE' : 'GET_PROFILE_BY_NPI',
                    'NPI_number' : getCookie('NPI_number'),
                    'access_token' : getCookie('access_token')
                },
                // crossDomain: true,
                // dataType: 'jsonp',
                // The URL to make the request to.
                url: 'https://api.docformative.com/doctor.php',
                contentType: 'text/plain',
                success: function(data) {

                    if (data.SUCCESS === "YES") {
                        console.log('Success: ', data);
                        var $form = $('#profile-form');
                        localStorage.setItem('profileData', JSON.stringify(data.MESSAGE));

                        // Name 
                        if (data.MESSAGE.name) {
                            $form.find('input[name="name"]').val(data.MESSAGE.name)
                        } else if (data.MESSAGE.first_name && data.MESSAGE.last_name) {
                            $form.find('input[name="name"]').val(data.MESSAGE.first_name + ' ' +  data.MESSAGE.last_name)
                        }

                        // Address
                        if (data.MESSAGE.address && data.MESSAGE.city) {
                            $form.find('input[name="primary-address"]').val(data.MESSAGE.address + ', ' + data.MESSAGE.city + ' ' + data.MESSAGE.postal_code)
                            $form.find('input[name="primary-address"]').next().removeClass('fade-out');
                        }

                        // Phone number
                        if (data.MESSAGE.phone) {
                            $form.find('input[name="phone-address"]').val(data.MESSAGE.phone);
                            $form.find('input[name="phone-address"]').next().removeClass('fade-out');
                        }

                        // Primary taxonomy
                        if (data.MESSAGE.taxonomies) {
                            $form.find('input[name="primary-taxonomy"]').val(data.MESSAGE.taxonomies);
                            $form.find('input[name="primary-taxonomy"]').next().removeClass('fade-out');
                        }

                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }
                },
            
                error: function(data) {
                    console.warn('Error while sending the ajax request');
                }
            });
      }
    },

    signup : {
        init : function(){
            console.log('%c sign-up page only', 'color: green;');

            // step 1
            $('#signup-form-step-1').on('submit', function(e) {
                e.preventDefault();
                var $form = $(this);
                addLoadingOverlay($form);
                var $npiNumber = $form.find('input[name="npi-number"]');
                setCookie('NPI_number', $npiNumber.val(), {});

                $.ajax({
                    type: 'GET',
                    data: {
                        'TYPE' : 'GET_PROFILE_BY_NPI',
                        'NPI_number' : $npiNumber.val()
                    },
                    url: 'https://api.docformative.com/doctor.php',
                    contentType: 'text/plain',
                    success: function(data) {
                        if (data.SUCCESS === "YES") {
                            // console.log('Success: ', data);
                            setCookie('NPI_number', data.MESSAGE.number, {});
                            localStorage.setItem('signUpObject', JSON.stringify(data.MESSAGE));
                            location.href = '/signup-2.html';
                            removeLoadingOverlay($form);
                        } else {
                            console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                        }
                    },
                
                    error: function(data) {
                        console.warn('Error while sending the ajax request');
                    }
                });
            })

            // step 2
            $('#signup-form-step-2').on('submit', function(e) {
                e.preventDefault();
                var $form = $(this);
                var signUpObject = JSON.parse(localStorage.getItem('signUpObject'));

                addLoadingOverlay($form);

                signUpObject.name = $form.find('input[name="name"]').val();
                signUpObject.address = $form.find('input[name="primary-address"]').val();
                signUpObject.phone = $form.find('input[name="phone-address"]').val();
                signUpObject.taxonomies = $form.find('input[name="taxonomy"]').val();
                
                localStorage.setItem('signUpObject', JSON.stringify(signUpObject));
                removeLoadingOverlay($form);
                location.href = '/signup-3.html';
            })

            //step 3
            $('#signup-form-step-3').on('submit', function(e) {
                e.preventDefault();
                var $form = $(this);

                if ($form.find('input[name="password"]').val() != $form.find('input[name="confirm-password"]').val()) {
                    $form.find('input[name="password"], input[name="confirm-password"]').siblings('.input__info').addClass('fade-out');
                    $form.find('input[name="password"], input[name="confirm-password"]').siblings('.input__error').removeClass('fade-out');
                } else {
                    addLoadingOverlay($form);

                    var signUpObject = JSON.parse(localStorage.getItem('signUpObject'));
                    
                    signUpObject.TYPE = 'DOCTOR_SIGNUP';
                    signUpObject.NPI_number = getCookie('NPI_number');
                    signUpObject.email = $form.find('input[name="email"]').val();
                    signUpObject.password = $form.find('input[name="password"]').val();
                    
                    localStorage.setItem('signUpObject', JSON.stringify(signUpObject));
                    removeLoadingOverlay($form);
                    
                    $.ajax({
                        type: 'GET',
                        data: signUpObject,
                        url: 'https://api.docformative.com/doctor.php',
                        contentType: 'text/plain',
                        success: function(data) {
                            if (data.SUCCESS === "YES") {
                                // deleteCookie('NPI_number');
                                removeLoadingOverlay($form);
                                location.href = '/signup-4.html';
                            } else {
                                alert('SIGN UP FAILED, SEE CONSOLE FOR DETAILS');
                                console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                            }
                        },
                    
                        error: function(data) {
                            // TODO Update the error handling after the Sign up is ready
                            alert('SIGN UP FAILED, SEE CONSOLE FOR DETAILS');
                            console.warn('Error while sending the ajax request');
                        }
                    });
                }
            })
        }
    },

    login : {
        init : function(){
            console.log('%c login page only', 'color: green;');
            //login form
            $('#login-form').on('submit', function(e) {
                e.preventDefault();
                var $form = $(this);

                $form.siblings('.tile__overlay').removeClass('hide'); //show form overlay while loading
                $form.find('input[type="submit"]').attr('disabled', 'disabled');

                $.ajax({
                    type: 'GET',
                    data: convertArrayToOjbject($(this).serializeArray()),
                    url: 'https://api.docformative.com/auth.php',
                    contentType: 'text/plain',
                    success: function(data) {
                        $form.siblings('.tile__overlay').addClass('hide');
                        $form.find('input[type="submit"]').removeAttr('disabled');

                        if (data.SUCCESS === "YES") {
                            setCookie('access_token', data.MESSAGE.token, {});
                            // console.info('success! \n token: ', getCookie('access_token'));
                            console.log(data.MESSAGE);
                            location.href = './home.html';
                        } else {
                            $form.find('.form-error').text(data.MESSAGE).removeClass('hide');
                            console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                        }
                    },
                
                    error: function(data) {
                        $form.siblings('.tile__overlay').addClass('hide');
                        $form.find('input[type="submit"]').removeAttr('disabled');
                        console.warn('Error while sending the ajax request');
                    }
                });
            })

        $('#login-form').on('change', function(){
            if($(this).is(':valid')) {
                $(this).find('.form-error').addClass('hide').text('');
            }
        });
      }
    },

    companies : {
        init : function(){
            console.log('%c companies page only', 'color: green;');
            addLoadingOverlay($('#companies-main'));
            $.ajax({
                type: 'GET',
                data: {
                    'TYPE'  : 'GET_COMPANIES',
                    'token' : getCookie('access_token')
                },
                url: 'https://api.docformative.com/companies.php',
                contentType: 'text/plain',
                success: function(data) {
                    var companiesObject = data.MESSAGE;
                    if (data.SUCCESS === "YES") {
                        console.log(data);
                        localStorage.setItem('companiesObject', JSON.stringify(companiesObject));
                        $('#companies-page-container').html('');
                        for (var key in companiesObject) {
                            $('#companies-page-container').append(formatFavData(companiesObject[key].pic, companiesObject[key].name, './company.html?company-id=' + companiesObject[key]._id, 'company-link'));
                        }
                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }
                    
                    removeLoadingOverlay($('#companies-main'));
                },
    
                error: function(data) {
                    console.warn('Error while trying to logout');
                }
            });
        }
    },

    company : {
        init : function(){
            console.log('%c company page only', 'color: green;');

            $.ajax({
                type: 'GET',
                data: {
                    'TYPE'  : 'GET_COMPANIES',
                    'token' : getCookie('access_token')
                },
                url: 'https://api.docformative.com/companies.php',
                contentType: 'text/plain',
                success: function(data) {
                    var companiesObject = data.MESSAGE;
                    if (data.SUCCESS === "YES") {
                        // console.log(data);
                        localStorage.setItem('companiesObject', JSON.stringify(companiesObject));

                        var companyID = localStorage.getItem('activeCompany');
                        if (companyID) {
                            var companiesObjectCurrent = companiesObject.filter(obj => {return obj._id === companyID})[0];
                            var $like = $('#company .js-like');
                            
                            if (companiesObjectCurrent.is_favorite && companiesObjectCurrent.is_favorite == 'YES') {
                                $like.addClass("like--active");
                            } else {
                                $like.removeClass("like--active");
                            }
                        }
                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }
                },
    
                error: function(data) {
                    console.warn('Error while trying update company');
                }
            });
        }
    },

    news: {
        init: function() {
            console.log('%c news page only', 'color: green;');

            //updating the news
            $.ajax({
                type: 'GET',
                data: {
                    'TYPE'  : 'GET_NEWS',
                    'token' : getCookie('access_token')
                },
                url: 'https://api.docformative.com/news_feed.php',
                contentType: 'text/plain',
                success: function(data) {
                    if (data.SUCCESS === "YES") {
                        console.log(data);
                        var newsObject = data.MESSAGE;

                        if (newsObject) {
                            // Put the object into storage
                            localStorage.setItem('newsObject', JSON.stringify(newsObject));
                            let i = 0;
                            $('#news-bottom-container').html('');
                            for (var key in newsObject) {
                                i++;
                                if (newsObject.hasOwnProperty(key) && i < 3) {
                                    $('#news-bottom-container').append(formatNewsData(newsObject[key].pic, newsObject[key].title, newsObject[key].id));
                                }
                            }

                            var newsID = localStorage.getItem('activeNews');
                            if (newsID) {
                                var newsObjectCurrent = newsObject.filter(obj => {return obj.id === newsID})[0];
                                var $like = $('#news .js-like');
                                
                                if (newsObjectCurrent.is_favorite && newsObjectCurrent.is_favorite == 'YES') {
                                    $like.addClass("like--active");
                                } else {
                                    $like.removeClass("like--active");
                                }
                            }
                        }

                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }
                },
    
                error: function(data) {
                    console.warn('Error while trying to update the news');
                }
            });
        }
    },

    home: {
        init : function(){
            console.log('%c home page only', 'color: green;');
            addLoadingOverlay($('#home-main'));
            //updating the news
            $.ajax({
                type: 'GET',
                data: {
                    'TYPE'  : 'GET_NEWS',
                    'token' : getCookie('access_token')
                },
                url: 'https://api.docformative.com/news_feed.php',
                contentType: 'text/plain',
                success: function(data) {
                    if (data.SUCCESS === "YES") {
                        console.log(data);
                        var newsObject = data.MESSAGE;

                        if (newsObject) {
                            // Put the object into storage
                            localStorage.setItem('newsObject', JSON.stringify(newsObject));
                            let i = 0;
                            $('#news-container-main').html('');
                            $('#fav-container-main').html('');
                            for (var key in newsObject) {
                                i++;
                                if (newsObject.hasOwnProperty(key) && i < 4) {
                                    $('#news-container-main').append(formatNewsData(newsObject[key].pic, newsObject[key].title, newsObject[key].id));
                                }

                                if (newsObject.hasOwnProperty(key) && newsObject[key].is_favorite == "YES") {
                                    $('#fav-container-main').append(formatFavData(newsObject[key].pic, newsObject[key].title, './news-article.html?news-id=' + newsObject[key].id,  'news-link'));
                                }
                            }
                        }
                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }

                    removeLoadingOverlay($('#home-main'));
                },
    
                error: function(data) {
                    console.warn('Error while trying to update the news');
                }
            });

            //updating the companies list
            $.ajax({
                type: 'GET',
                data: {
                    'TYPE'  : 'GET_COMPANIES',
                    'token' : getCookie('access_token')
                },
                url: 'https://api.docformative.com/companies.php',
                contentType: 'text/plain',
                success: function(data) {
                    if (data.SUCCESS === "YES") {
                        // console.log(data);
                        var companiesObject = data.MESSAGE;

                        if (data.MESSAGE) {
                            // Put the object into storage
                            localStorage.setItem('companiesObject', JSON.stringify(companiesObject));

                            for (var key in companiesObject) {
                                if (companiesObject.hasOwnProperty(key) && companiesObject[key].is_favorite == "YES") {
                                    $('#fav-container-main').append(formatFavData(companiesObject[key].pic, companiesObject[key].name, './company.html?company-id=' + companiesObject[key]._id, 'company-link'));
                                }
                            }
                        }

                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }
                },
    
                error: function(data) {
                    console.warn('Error while trying to update the companies');
                }
            });

            //updating the products list
            $.ajax({
                type: 'GET',
                data: {
                    'TYPE'  : 'GET_PRODUCTS',
                    'token' : getCookie('access_token')
                },
                url: 'https://api.docformative.com/products.php',
                contentType: 'text/plain',
                success: function(data) {
                    if (data.SUCCESS === "YES") {
                        console.log(data);
                        var productsObject = data.MESSAGE;

                        if (data.MESSAGE) {
                            // Put the object into storage
                            localStorage.setItem('productsObject', JSON.stringify(productsObject));

                            for (var key in productsObject) {
                                if (productsObject.hasOwnProperty(key) && productsObject[key].is_favorite == "YES") {
                                    $('#fav-container-main').append(formatFavData(productsObject[key].pic, productsObject[key].name), './drugs.html?product-id=' + productsObject[key].id,  'product-link');
                                }
                            }
                        }

                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }
                },
    
                error: function(data) {
                    console.warn('Error while trying to update the products');
                }
            });
        }
    },

    dialog : {
        init : function(){
            console.log('%c company page only', 'color: green;');

            $.ajax({
                type: 'GET',
                data: {
                    'TYPE'  : 'GET_ALL_CHATS',
                    'token' : getCookie('access_token'),
					'user_1' : 'doctor1', //[TODO] dummy data, to be updated
					'UDID' : 'string', //[TODO] dummy data, to be updated
					"device": "string" //[TODO] dummy data, to be updated
                },
                
                url: 'https://api.docformative.com/chats.php',
                contentType: 'text/plain',
                success: function(data) {
                    var dialogsArray = data.MESSAGE;
                    if (data.SUCCESS === "YES") {
                        var latestMessagesArray = [];
                        console.log(data);
                        localStorage.setItem('dialogsArray', JSON.stringify(dialogsArray));
                        dialogsArray.reverse().forEach(function (arrayItem) {
                            if (latestMessagesArray.filter(e => e.user_2 === arrayItem.user_2).length > 0) {
                                return;
                            } else {
                                latestMessagesArray.push(arrayItem);
                            }
                        });
                        
                        dialogsArray.reverse();

                        latestMessagesArray.sort(function(a, b){
                            console.log('sorted');
                            return a.timestamp < b.timestamp;
                        });

                        console.log(latestMessagesArray);

                    } else {
                        console.warn(data.MESSAGE, '\n error code: ', data.ERROR);
                    }
                },
    
                error: function(data) {
                    console.warn('Error while trying update the chats');
                }
            });
        }
    }
}

$(document).ready(function() {
    UTIL.loadEvents();
});