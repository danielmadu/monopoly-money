angular.module('monopoly.gameService', [])

.factory('GameService', ['$rootScope', '$http', 'UserService', function($rootScope, $http, UserService) {
	var amount = 1490;
	var properties = [];

	var getProperties = function() {
		$http.get('/data/getProperties.php').then(function(response) {
			for (i=0 ; i < response.data.length ; i++) {
				properties.push(response.data[i]);
			}
		}, function(error){});
	}

	var getBuyableProperties = function(success, error) {
		$http.get('/data/getBuyableProperties.php').then(function(response) {
			success(response.data);
		}, function(error) {});
	}

	var buyProperty = function(card, success, error) {
		var data = $.param({
			user: UserService.user.id,
			property: card.id
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postBuyProperty.php', data, config).then(function(response) {
			if (response.data > 0) {
				UserService.user.credit -= card.price;
			}
			success(response.data);
		}, function(responseError) {});
	}

	var addMoney = function(amount, success, error) {
		var data = $.param({
			user: UserService.user.id,
			credit: amount
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postAddMoney.php', data, config).then(function(response) {
			if (response.data > 0) {
				UserService.user.credit += parseInt(amount);
			}
			success(response.data);
		}, function(responseError) {});
	}

	var delMoney = function(amount, success, error) {
		var data = $.param({
			user: UserService.user.id,
			credit: amount
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postDelMoney.php', data, config).then(function(response) {
			UserService.user.credit -= parseInt(amount);
			UserService.freeParking += parseInt(amount);
			success(response.data);
		}, function(responseError) {
			error();
		});
	}

	var buyHouse = function(card, success, error) {
		var data = $.param({
			user: UserService.user.id,
			property: card.id
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postBuyHouse.php', data, config).then(function(response) {
			if (response.data > 0) {
				UserService.user.credit -= parseInt(card.house);
			}
			success(response.data);
		}, function(responseError) {
			error();
		});
	}

	var sellHouse = function(card, nb, success, error) {
		var data = $.param({
			user: UserService.user.id,
			property: card.id,
			nbSell: nb
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postSellHouse.php', data, config).then(function(response) {
			if (response.data > 0) {
				var amount = (card.house / 2) * nb;
				UserService.user.credit += amount;
			}
			success(response.data);
		}, function(responseError) {
			error();
		});
	}

	var payRental = function(_rental, _player, success, error) {
		var data = $.param({
			rental: _rental,
			player: _player.id,
			user: UserService.user.id
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postPayRental.php', data, config).then(function(response) {
			if (response.data > 0) {
				UserService.user.credit -= _rental;
			}
			success();
		}, function(responseError) {
			error(responseError);
		});
	}

	var getFreeParkingAmount = function(success, error) {
		$http.get('/data/getFreeParkingAmount.php').then(function(response) {
			UserService.freeParking = parseInt(response.data);
		},function(responseError) {
			console.error(responseError);
		});
	}

	var getFreeParking = function(success, error) {
		var data = $.param({
			user: UserService.user.id
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postFreeParking.php', data, config).then(function(response) {
			if (response.status == 200) {
				UserService.user.credit += UserService.freeParking;
				UserService.freeParking = 0;
			}
			success();
		}, function(responseError) {
			error(responseError);
		});
	}

	var start = function(success, error) {
		$http({
			method: 'GET',
			url: '/data/getStart.php',
			params: {user: UserService.user.id}
		}).then(function(response) {
			if (response.status == 200) {
				UserService.user.credit += 200;
			}
			success();
		}, function(responseError) {
			error(responseError);
		});
	}

	var birthday = function(playerId, success, error) {
		var data = $.param({
			user: UserService.user.id,
			player: playerId
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postBirthday.php', data, config).then(function(response) {
			if (response.status == 200) {
				UserService.user.credit -= 10;
			}
			success();
		}, function(responseError) {
			error(responseError);
		});
	}

	var hypothecProperty = function(_property, success, error) {
		var data = $.param({
			user: UserService.user.id,
			property: _property.id
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postHypothecProperty.php', data, config).then(function(response) {
			if (response.status == 200) {
				UserService.user.credit += parseInt(_property.hypotheque);
			}
			success();
		}, function(responseError) {
			error(responseError);
		});
	}

	var swapProperty = function(card, _player, success, error) {
		var data = $.param({
			user: UserService.user.id,
			property: card.id,
			player: _player.id
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}
		$http.post('/data/postSwapProperty.php', data, config).then(function(response) {
			success();
		}, function(responseError) {
			error(responseError);
		});
	}

	return {
		amount: amount,
		properties: properties,
		getProperties, getProperties,
		getBuyableProperties: getBuyableProperties,
		buyProperty: buyProperty,
		addMoney: addMoney,
		delMoney: delMoney,
		buyHouse: buyHouse,
		sellHouse: sellHouse,
		payRental: payRental,
		getFreeParkingAmount: getFreeParkingAmount,
		getFreeParking: getFreeParking,
		start: start,
		birthday: birthday,
		hypothecProperty: hypothecProperty,
		swapProperty: swapProperty
	};
}])

;