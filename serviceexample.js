function dataService() {
        var data;
        function setData( data ) {
            dataService.data = data;
            return
        }
        function getData() {
            return dataService.data
        }
        var dataService = {
            data: data,
            setData: setData,
            getData: getData
        }
        return dataService
    };