/*****
  The Dealer-Display module is designed to
  listen for the any criteria changes from the
  "dealer filter" and update the displayed dealers
  accordingly.
*****/


(function($) {


 	var dom;


  // load the dealer data
 	var loadDealerData = function() {
		$.getJSON("src/js/dealers.json", renderDealers);
  	};


  // cache necessary dom nodes for this module
	var cacheDom = function() {
		dom = {};
 		dom.document = $(document);
	 	dom.filter_count = dom.document.find('.dealer-filter__count');

	};


  // bind event handlers for this module
	var bindEventHandlers = function() {
		dom.document.on('dealer_filter_criteria_changed', onDealerFilterCriteriaChanged);
		dom.document.on('click', '.dealerEmailButton', onDealerEmailBtnClicked);
	};

	var onDealerEmailBtnClicked = function() {
		var $template = $(this).parents('.templateDiv');
		var $dealerNameElement = $template.find('.dealerName');
		$('.dealerEmailButton_name').text($dealerNameElement.text());
		$('.modal_form-span-dealerName').text($dealerNameElement.text());
  };


  // display dealers based on new criteria
	var onDealerFilterCriteriaChanged = function(eventData) {
		var $dealers = $('.template_container');
		var i;
		var j;

    // if no certification criteria is provided, show ALL the dealers
	if (eventData.certifications.length == 0) {
		$dealers.show();
		return;
	}

    // if certification criteria provided, only show matching dealers
	for (i = 0; i < $dealers.length; i++) {

		for (j = 0; j < eventData.certifications.length; j++) {

			if ($dealers.eq(i).attr('data-certifications').indexOf(eventData.certifications[j]) >= 0) {
				$dealers.eq(i).show();
				break;
			} else {
				$dealers.eq(i).hide();
			}
		}
	}

 	};


    // render the dealers
	var renderDealers = function(response) {

		var template = document.querySelector('#tmplt');

    // loop over dealers to build markup
		for (var i=0; i < response.dealers.length; i++) {
			var dealer = response.dealers[i].data;
			var templateClone = template.content.cloneNode(true);

			// prepare the dealer markup
			templateClone.querySelector('.dealerName').innerHTML = dealer.name;
			templateClone.querySelector('.dealerPhone').innerHTML = '<img src="src/images/phone-icon-desktop.png" class="phone-icon">' + '<span class="tap-to-call">Tap to call</span>' + dealer.phone1.replace( /-/g ,".");
			templateClone.querySelector('.dealerPhone').href = "tel:" + dealer.phone1;
			templateClone.querySelector('.dealerCantTalk').innerHTML = "Can't talk now? Click below to send an email.";
			templateClone.querySelector('.dealerEmailButton').innerHTML = '<img src="src/images/email-icon.png" class="email-Icon"> Contact this Pro';
			templateClone.querySelector('.dealerEmailButton_name').innerHTML = dealer.name;
			templateClone.querySelector('.modal_form-span-dealerName').innerHTML = dealer.name;
			templateClone.querySelector('.dealerBusHours').innerHTML = "Business Hours";
			templateClone.querySelector('.dealerWeekdayHours').innerHTML = "Weekdays: " + dealer.weekHours.mon;
			templateClone.querySelector('.dealerSatHours').innerHTML = dealer.weekHours.sat == "" ? "Saturdays: CLOSED" : "Saturdays: " + dealer.weekHours.sat;
			templateClone.querySelector('.dealerSunHours').innerHTML = dealer.weekHours.sun == "" ? "Sundays: CLOSED" : "Sundays: " + dealer.weekHours.sun;
			templateClone.querySelector(".dealerCerts").appendChild(buildCertificationList(dealer.certifications));
			templateClone.querySelector('.template_container').setAttribute('data-certifications', dealer.certifications);

		// inject this dealer template into the dom
			template.parentNode.appendChild(templateClone);
		}
	};


  // build the list of dealer certifications
	var buildCertificationList = function(array) {
		var list = document.createElement('ul');
		list.setAttribute('class' , 'dealerUL');

		for(var i = 0; i < array.length; i++) {
			var item = document.createElement('li');
			item.setAttribute('class', 'dealerLI');
			if (array[i] == "Installation Pro") {
				item.innerHTML = '<img src="src/images/star-installation-pro.png" class="cert_icons">'
			} else if (array[i] == "Service Pro") {
				item.innerHTML = '<img src="src/images/gear-service-pro.png" class="cert_icons">'
			} else if (array[i] == "Residential Pro") {
				item.innerHTML = '<img src="src/images/home-residential-pro.png" class="cert_icons">'
			} else if (array[i] == "Commercial Pro") {
				item.innerHTML = '<img src="src/images/users-commercial-pro.png" class="cert_icons">'
			}
			item.appendChild(document.createTextNode(array[i]));
			list.appendChild(item);
		}
		return list;
	}


  // initialize the module
	var init = function() {
		cacheDom();
		bindEventHandlers();
		loadDealerData();
  };


  // initialize this bad boy!
  init();


}(jQuery));
