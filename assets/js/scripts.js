// Функция определения, пуста ли строка!!!

function isStrEmpty(str) {
  return (str.length == 0);
}


// Функция форматирования адреса, вводимого в форму!!!

function getFormattedAddress(m_zip, m_country, m_city, m_address) {
  formatted_address = m_address + ", " + m_city + ", " + m_zip + ", " + m_country;
  return encodeURI(formatted_address);
}

/*function getCoordinates() {
  geocoder.geocode({"address": request_address}, function(result) {
    console.log(geocoder.geocode({}));
  });

}*/


// Функция определения текущего адреса!!!

function getCurrentLocation() {
  geocoder.geocode({"latLng": coordinates}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setZoom(17);
      marker = new google.maps.Marker({
          position: coordinates,
          map: map
      });
      infowindow.setContent(results[0].formatted_address);
      marker.addListener('click', function() {
          infowindow.open(map, marker);
      });
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}



$(document).ready(function() {

	$('.image-slider').slick({

	"autoplay": true,
	"slidesToShow": 3,
	"centerMode": true

	});

	$('.image-slider').on('beforeChange', function(){

	$(".image-slider .image-slide").addClass("slick-changing");

	});

	$('.image-slider').on('afterChange', function(){

  		$(".image-slider .image-slide").removeClass("slick-changing");

	});

	$(document).on("click", "[data-toggle='modal']", function(e) {

		e.preventDefault();
		var el_selector = $(this).attr("data-target");
		$(el_selector).fadeIn();

	});

  $(document).on('click', '.tabs-navigation li a', function(e){
    
    e.preventDefault();
    var tab_id = $(this).parent().attr('data-tab');
    $('.active[data-tab]').removeClass('active');
    $('[data-tab="' + tab_id + '"]').addClass('active');
    
  });
  
  $(document).on('click', '.tabs-next', function(e){
    e.preventDefault();
    var tab_id = $('.active[data-tab]').attr('data-tab');
    tab_id++;
    
    if ( $('[data-tab=' + tab_id + ']').length == 0 ){
      tab_id = $('[data-tab]:first-child').attr('data-tab');
    }
    
    $('.active[data-tab]').removeClass('active');
    $('[data-tab="' + tab_id + '"]').addClass('active');
    
  });
  
  $(document).on('click', '.tabs-prev', function(e){
    e.preventDefault();
    var tab_id = $('.active[data-tab]').attr('data-tab');
    tab_id--;
    
    if ( $('[data-tab=' + tab_id + ']').length == 0 ){
      tab_id = $('[data-tab]:last-child').attr('data-tab');
    }
    
    $('.active[data-tab]').removeClass('active');
    $('[data-tab="' + tab_id + '"]').addClass('active');    
  });
  
  setInterval(function(){
    
    if ( $('.tabs-block:hover').length == 0 ){
      
      var tab_id = $('.active[data-tab]').attr('data-tab');
      tab_id++;
      
      if ( $('[data-tab=' + tab_id + ']').length == 0 ){
        tab_id = $('[data-tab]:first-child').attr('data-tab');
      }
      
      $('.active[data-tab]').removeClass('active');
      $('[data-tab="' + tab_id + '"]').addClass('active');
      
    }
    
  }, 3000);
  
  $(document).on('click', '.tabs-prev', function(e){
    e.preventDefault();
  });

    populateCountries("map-country");

  	$(document).on("click", ".tabs-prev", function(e) {

  		e.preventDefault();
  		var current_tab_id = $(".active[data-tab]").attr("data-tab");
  		current_tab_id--;

  		if ( $(".active[data-tab = " + current_tab_id + " ]" ).length > 0 ) {

  			$(".active[data-tab]").removeClass("active");
  			$("[data-tab=" + current_tab_id + "]").addClass("active");

  		} else {

  			tab_id = $(".active[data-tab]:last-child").attr("data-tab");
  			$(".active[data-tab]").removeClass("active");
  			$("[data-tab=" + current_tab_id + "]").addClass("active");

  		}

  	});

    $(document).on('click', ".map-title", function () {
        $(".location-form").slideToggle();
    });


    // Event определения адреса по данным которые ввели в форму!!!

    $(document).on('submit', '.location-form form', function(e){
    e.preventDefault(); //isEmpty()
    var country = $('#map-country').val();
    var city = $('#map-city').val();
    var address = $('#map-address').val();
    var zip = $('#map-zip').val();
    var validated = true;
    
    if (isStrEmpty(country) || country == '-1'){
      $('#map-country').closest('.map-form-field').addClass('error');
      validated = false;
    } else {
      $('#map-country').closest('.map-form-field').removeClass('error');
    }
    
    if (isStrEmpty(city)){
      $('#map-city').closest('.map-form-field').addClass('error');
      validated = false;
    } else {
      $('#map-city').closest('.map-form-field').removeClass('error');
    }
    
    if (isStrEmpty(address)){
      $('#map-address').closest('.map-form-field').addClass('error');
      validated = false;
    } else {
      $('#map-address').closest('.map-form-field').removeClass('error');
    }
    
    if (isStrEmpty(zip) || zip.length != 5){
      $('#map-zip').closest('.map-form-field').addClass('error');
      validated = false;
    } else {
      $('#map-zip').closest('.map-form-field').removeClass('error');
    }
    
    if (validated){
      
      request_address = getFormattedAddress(zip, country, city, address);
      var request_link = 'https://maps.google.com/maps/api/geocode/json?address=' + request_address;
      $.post(
        request_link, 
        {}, 
        function(response){
          if (typeof response.results != 'undefined' && response.status == 'OK'){
            coordinates = response.results[0].geometry.location;
            map.setZoom(18);          
            map.setCenter(coordinates);
            marker.setPosition(coordinates);
            infowindow.setContent('<p>' + response.results[0].formatted_address + '</p>');
            $('.location-form').slideUp();
          } else {
            alert('Address not found!');
          }
        }
      );
      
    }
    
  });

    $(document).on('click', ".clear", function(e) {
      
      e.preventDefault();
      $(".map-form-filled").find(":input").val("");

    });


    // Event определения текущих координат(местоположения) !!!

    $(document).on('click', '.show_location', function(e){
    e.preventDefault();
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){            
        coordinates = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude
        };
        map.setCenter(coordinates);
        getCurrentLocation();
        $('.location-form').slideUp();
      });
    }
  });

	$(document).on("click", ".modal .close-modal", function(e) {

		e.preventDefault();
		$(this).closest(".modal").fadeOut();

	});

	$(".phone-input").mask("(999)999-99-99");

	var fixed_head_pos, fixed_head_height;
	fixed_head_pos = $(".head-row-second").offset().top;
	fixed_head_height = $(".head-row-second").height();

	$(document).scroll(function() {

		var scroll_top = $(window).scrollTop();
		if ( scroll_top >= fixed_head_pos ) {
			$(".head-row-second").addClass("fixed");
			$("body").css("padding-top", fixed_head_height + "px");
		} else {
			$(".head-row-second").removeClass("fixed");
			$("body").css("padding-top", 0);
		}

	});

	jQuery('.date-input').datetimepicker();

	/*$(".main-menu li").hover (
	function() {
		$(this).css("background", "#FFA726");
	},
	function() {
		$(this).css("background", "#E65100");
	}
	);*/

	$(".main-menu li").hover (
		function() {
			$(this).addClass("hover");
		},
		function() {
			$(this).removeClass("hover");
		}
	);

});

$(window).load(function() {

	$('.masonry-content').masonry({
    'itemSelector': '.masonry', 
    'gutter': '.masonry-gutter',
    'columnWidth': '.masonry-sizer',
    'percentPosition': true
  });
    
  var tabs_max_height = 0;
  $('.tabs-content .tab-content').css('display', 'block');

  $('.tabs-content .tab-content').each(function(){
    var height = $(this).outerHeight(true);
    if (height > tabs_max_height){
      tabs_max_height = height;
    }
  });
  
  $('.tabs-content').css('height', tabs_max_height + 'px'); 
  $('.tabs-content .tab-content').css('display', ''); 


});