// JS
// Admin No: 191378L
// Name:Jeanie Chen
// PEM: 03
var trafficjson, areasofhawk, mymap;

function loadmap() {
    //initialising the map
    mymap = L.map('map').setView([1.3521, 103.8198], 12);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        // how far can u zoom
        maxZoom: 14,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiamVhbmJlYW4iLCJhIjoiY2tpaXp3Z2RxMGVlMzJ4bjB0cGpid3RhZCJ9.MGW9qC92DrQvaeO6UOHAVw'
    }).addTo(mymap);
}


function loadlivedata() {
    $.ajax({
            url: "https://api.data.gov.sg/v1/transport/traffic-images",


        })

        .done(function (json) {

                trafficjson = json;
                //giving me the array in the console log
                console.log(trafficjson);
                //i did this so that i can do the array to target the locations
                var cameras = trafficjson.items[0].cameras;
                //i did this to target the lng and lat
                var locations = cameras.location;

                //array for the lng and lat
                for (i = 0; i < trafficjson.items[0].cameras.length; i++) {
                    cameras = trafficjson.items[0].cameras[i];
                    lon = cameras.location.longitude;
                    lat = cameras.location.latitude;
                    //basically how we do the circles of all the coords of each cameras
                    window['circle' + i] = L.circle([lat, lon], {
                        color: 'green',
                        fillColor: 'blue',
                        fillOpacity: 0.5,
                        radius: 80
                    }).addTo(mymap).on("click", imagepop);


                }

                function imagepop(e) {
                    //this is the separation of the array
                    var coords = e.latlng;
                    var lat = coords.lat;
                    var lng = coords.lng;
                    //image is for the cam.image
                    var img;
                    console.log(coords);
                    $(".image-container").css("display", "block");
                    $(".infocard").css("bottom","0px");

                    for (i = 0; i < trafficjson.items[0].cameras.length; i++) {
                        cam = trafficjson.items[0].cameras[i];
                        arraylong = cam.location.longitude;
                        arraylat = cam.location.latitude;
                        //basically if all the coordinated are like the same as the camera cords it will display the image of the camera.
                        if (lat == arraylat && lng == arraylong) {
                            console.log(cam.image);
                            img = cam.image;
                            i = trafficjson.items[0].cameras.length;
                            $(".place-image").css(`background-image`, `url(${img})`);

                        } else {
                            console.log("not found");
                        }

                    }

                    uno_reverse(lat, lng);
                    //basically just replacing the name for the text.
                    function uno_reverse(lat, lng) {
                        $.ajax({
                                type: "GET",
                                //file name or URL here
                                url: "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + lng + "&localityLanguage=en",
                                dataType: "json"
                            })
                            .done(function (json) {
                                console.log(json)
                                console.log("Geocode successfully loaded");
                                // CHANGE SEARCH FIELD VALUE TO USERS LOCATION ON JSON LOAD
                                $(".name-location").html("Location: " + json.locality.replace("GRC", "").replace("SMC", ""));
                            })
                            .fail(function () {
                                console.log("Geocode loading error");
                            });
                    }

                }

            }
            // var booba=trafficjson.items[0].cameras[0].image
            // $(".test").append("<img src="+trafficjson.items[0].cameras[76].image+">");
        )
}


$(function () {
    loadlivedata();
    loadmap();
    $(".close-btn").click(function () {
        $(".image-container").css("display", "none");
        $(".name-location").html("Location: ");
    });
// the hammer plugin
    var myElement = document.getElementById('panning');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);
    mc.get('pan').set({
        direction: Hammer.DIRECTION_ALL
    });
    // listen to events...
    mc.on("pandown panup panleft", function (ev) {
        console.log(ev.type);
        switch (ev.type) {
            case "panup":
                $("#panning").css("bottom", "0px");
                console.log("up");
                break;

            case "pandown":
                $("#panning").css("bottom", "-230px");
                break;

            case "panleft":
                $("#panning").css("left","-425px");
                console.log("gogo")
                break;
        }


    });

    var myElement = document.getElementById('gogo');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);
    mc.get('pan').set({
        direction: Hammer.DIRECTION_ALL
    });
    // listen to events...
    mc.on("pandown panup panleft", function (ev) {
        console.log(ev.type);
        switch (ev.type) {
            case "panleft":
                $("#gogo").css("left", "-432px");
                console.log("gogo");
                break;
        }


    });

})