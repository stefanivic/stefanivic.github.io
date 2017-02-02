var prev = 0;
var $window = $(window);
var nav = $('.navigation');

$window.on('scroll', function(){
  var scrollTop = $window.scrollTop();
  nav.toggleClass('hidden', scrollTop > prev);
  prev = scrollTop;
});

google.maps.event.addDomListener(window, 'load', init);
var map, markersArray = [];

function bindInfoWindow(marker, map, location) {
google.maps.event.addListener(marker, 'click', function() {
    function close(location) {
        location.ib.close();
        location.infoWindowVisible = false;
        location.ib = null;
    }

    if (location.infoWindowVisible === true) {
        close(location);
    } else {
        markersArray.forEach(function(loc, index){
            if (loc.ib && loc.ib !== null) {
                close(loc);
            }
        });

        var boxText = document.createElement('div');
        boxText.style.cssText = 'background: #fff;';
        boxText.classList.add('md-whiteframe-2dp');

        function buildPieces(location, el, part, icon) {
            if (location[part] === '') {
                return '';
            } else if (location.iw[part]) {
                switch(el){
                    case 'photo':
                        if (location.photo){
                            return '<div class="iw-photo" style="background-image: url(' + location.photo + ');"></div>';
                         } else {
                            return '';
                        }
                        break;
                    case 'iw-toolbar':
                        return '<div class="iw-toolbar"><h3 class="md-subhead">' + location.title + '</h3></div>';
                        break;
                    case 'div':
                        switch(part){
                            case 'email':
                                return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span><a href="mailto:' + location.email + '" target="_blank">' + location.email + '</a></span></div>';
                                break;
                            case 'web':
                                return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span><a href="' + location.web + '" target="_blank">' + location.web_formatted + '</a></span></div>';
                                break;
                            case 'desc':
                                return '<label class="iw-desc" for="cb_details"><input type="checkbox" id="cb_details"/><h3 class="iw-x-details">Details</h3><i class="material-icons toggle-open-details"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><p class="iw-x-details">' + location.desc + '</p></label>';
                                break;
                            default:
                                return '<div class="iw-details"><i class="material-icons"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span>' + location[part] + '</span></div>';
                            break;
                        }
                        break;
                    case 'open_hours':
                        var items = '';
                        for (var i = 0; i < location.open_hours.length; ++i) {
                            if (i !== 0){
                                items += '<li><strong>' + location.open_hours[i].day + '</strong><strong>' + location.open_hours[i].hours +'</strong></li>';
                            }
                            var first = '<li><label for="cb_hours"><input type="checkbox" id="cb_hours"/><strong>' + location.open_hours[0].day + '</strong><strong>' + location.open_hours[0].hours +'</strong><i class="material-icons toggle-open-hours"><img src="//cdn.mapkit.io/v1/icons/keyboard_arrow_down.svg"/></i><ul>' + items + '</ul></label></li>';
                        }
                        return '<div class="iw-list"><i class="material-icons first-material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><ul>' + first + '</ul></div>';
                         break;
                 }
            } else {
                return '';
            }
        }

        boxText.innerHTML =
            buildPieces(location, 'photo', 'photo', '') +
            buildPieces(location, 'iw-toolbar', 'title', '') +
            buildPieces(location, 'div', 'address', 'location_on') +
            buildPieces(location, 'div', 'web', 'public') +
            buildPieces(location, 'div', 'email', 'email') +
            buildPieces(location, 'div', 'tel', 'phone') +
            buildPieces(location, 'div', 'int_tel', 'phone') +
            buildPieces(location, 'open_hours', 'open_hours', 'access_time') +
            buildPieces(location, 'div', 'desc', 'keyboard_arrow_down');

        var myOptions = {
            alignBottom: true,
            content: boxText,
            disableAutoPan: true,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-140, -40),
            zIndex: null,
            boxStyle: {
                opacity: 1,
                width: '280px'
            },
            closeBoxMargin: '0px 0px 0px 0px',
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: 'floatPane',
            enableEventPropagation: false
        };

        location.ib = new InfoBox(myOptions);
        location.ib.open(map, marker);
        location.infoWindowVisible = true;
    }
});
}

function init() {
var mapOptions = {
    center: new google.maps.LatLng(44.030222897645196,20.900572683593737),
    zoom: 16,
    fullscreenControl: true,
    zoomControl: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    scaleControl: false,
    scrollwheel: true,
    streetViewControl: false,
    draggable : true,
    clickableIcons: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
}
var mapElement = document.getElementById('mapkit');
var map = new google.maps.Map(mapElement, mapOptions);
var locations = [
    {"title":"Аеродром","address":"Аеродром, Крагујевац, Србија","desc":"","tel":"","int_tel":"","email":"","web":"","web_formatted":"","open":"","time":"","lat":44.0301874,"lng":20.905738199999973,"vicinity":"Маршић","open_hours":"","marker":{"fillColor":"#9E9E9E","fillOpacity":1,"strokeWeight":0,"scale":1.5,"path":"M10.2,7.4c-6,0-10.9,4.9-10.9,10.9c0,6,10.9,18.4,10.9,18.4s10.9-12.3,10.9-18.4C21.2,12.2,16.3,7.4,10.2,7.4z M10.2,22.9c-2.6,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6s4.6,2.1,4.6,4.6S12.8,22.9,10.2,22.9z","anchor":{"x":10,"y":30},"origin":{"x":0,"y":0},"style":1},"iw":{"address":true,"desc":true,"email":true,"enable":true,"int_tel":true,"open":true,"open_hours":true,"photo":true,"tel":true,"title":true,"web":true}}
];
for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
        icon: locations[i].marker,
        position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
        map: map,
        title: locations[i].title,
        address: locations[i].address,
        desc: locations[i].desc,
        tel: locations[i].tel,
        int_tel: locations[i].int_tel,
        vicinity: locations[i].vicinity,
        open: locations[i].open,
        open_hours: locations[i].open_hours,
        photo: locations[i].photo,
        time: locations[i].time,
        email: locations[i].email,
        web: locations[i].web,
        iw: locations[i].iw
    });
    markersArray.push(marker);

    if (locations[i].iw.enable === true){
        bindInfoWindow(marker, map, locations[i]);
    }
}
}
