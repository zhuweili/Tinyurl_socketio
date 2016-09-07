var app = angular.module("tinyurlApp");

var port_for_docker = 8000;

app.controller("urlController",
    ["$scope", "$http", "$routeParams", 'chartSocket',function ($scope, $http, $routeParams,chartSocket) {

    $http.get("/api/v1/urls/" + $routeParams.shortUrl)
        .success(function (data) {
            $scope.shortUrl = data.shortUrl;
            $scope.longUrl = data.longUrl;
            $scope.shortUrlToShow = "http://localhost:"+ port_for_docker + "/" + data.shortUrl;
        });
    $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
        .success(function(data) {
            $scope.totalClicks = data;
            $scope.lastTotalClicks = $scope.totalClicks;
        });
    $scope.getTime = function(time){
        $scope.lineLabels =[];
        $scope.lineData = [];
        $scope.time = time;
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
            .success(function(data) {
                data.forEach(function (info) {

                    var lengend = '';
                    if (time === 'hour') {
                        if (info._id.minutes < 10) {
                            info._id.minutes = '0' + info._id.minutes;
                        }
                        lengend = info._id.hour + ":" + info._id.minutes;
                    }
                    if (time === 'day') {
                        lengend = info._id.hour  + ':00';
                    }
                    if (time === 'month') {
                        lengend = info._id.month + "/" + info._id.day;
                    }

                    $scope['lineLabels'].push(lengend);
                    $scope['lineData'].push(info.count);
                });
            });
    };

    $scope.getTime('hour');


     var renderChart = function(chart, infos) {
         $scope[chart + 'Labels'] =[];
         $scope[chart + 'Data'] =[];
         $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
             .success(function(data) {
                 data.forEach(function (info) {
                     $scope[chart + 'Labels'].push(info._id);
                     $scope[chart + 'Data'].push(info.count);
                 });
             });
     };
        renderChart("pie", "referer");
        renderChart("doughnut", "country");
        renderChart("bar", "platform");
        renderChart("base", "browser");

     $scope.addcountry = function() {
         $scope['doughnutLabels'].push('China');
         $scope['doughnutData'].push(12);
     };

        $scope.visit_num = [];
        var mes = $routeParams.shortUrl;
        chartSocket.emit('shortUrl', mes);
        chartSocket.on('message', function(data) {
            console.log(data['message']);
            $scope.visit_num.push(data);
        });

        chartSocket.on('totalClicks', function(data) {
            if (data - $scope.lastTotalClicks > 20) {
                $scope.getTime('hour');
                $scope.lastTotalClicks = data;
            }
            $scope.totalClicks = data;
        });
        chartSocket.on('hour_chart', function(data) {
            $scope['hour' + 'Labels'] = [];
            $scope['hour' + 'Data'] = [];
            data.forEach(function (info) {
                $scope['hour' + 'Labels'].push(info._id);
                $scope['hour' + 'Data'].push(info.count);
            });
            //$scope.getTime('hour');
        });
}]);