/*****
  The Dealer-Filter module is designed to
  listen for user input on dealer certifications
  and broadcast that information for any other
  modules in the system to interact with as needed.
*****/

(function($) {


	// setup module variables
	var dom;
	var selectedDealerCertifications = [];


	// cache commonly used dom nodes
	var cacheDom = function() {

		dom = {};
		dom.document = $(document);
		dom.dealerFilter = dom.document.find('.dealer-filter');
		dom.dealerTypeCheckboxes = dom.dealerFilter.find('.dealer-filter__dealer-certification-checkbox');
	};


	// bind event handlers
	var bindEventHandlers = function() {

		//filter handler for desktop
		dom.dealerTypeCheckboxes.on('click', onDealerTypeCheckboxClicked);

		//filter handler for the mobile
		$("label").on('change', ':checkbox', onDealerTypeCheckboxClicked);
	};


	// process the dealer checkbox click
	var onDealerTypeCheckboxClicked = function() {

		var $checkbox = $(this);
		var isChecked = $checkbox.prop('checked');
		var thisCertification = $checkbox.val();
		var i;
		if (isChecked) { // checking item
			selectedDealerCertifications.push(thisCertification);
		} else { // unchecking item
			for (i = 0; i < selectedDealerCertifications.length; i++){
				if (selectedDealerCertifications[i] === thisCertification) {
					selectedDealerCertifications.splice(i, 1);
					break;
				}

			}

		}

		// trigger custom event to let other modules know filter criteria changed
		dom.document.trigger({
			type: 'dealer_filter_criteria_changed',
			certifications: selectedDealerCertifications
		});
	};


	// initialize the module
	var init = function() {
		cacheDom();
		bindEventHandlers();
	};


	// call init method
	init();


}(jQuery));
