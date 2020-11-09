import ymaps from "ymaps";

export default (props, panorama) => {
  ymaps
    .load()
    .then((map) => {
      if (panorama) {
        map.panorama.locate([55.733685, 37.588264]).done(
          function (panoramas) {
            // Убеждаемся, что найдена хотя бы одна панорама.
            if (panoramas.length > 0) {
              // Создаем плеер с одной из полученных панорам.
              var player = new map.panorama.Player(
                "panorama",
                // Панорамы в ответе отсортированы по расстоянию
                // от переданной в panorama.locate точки. Выбираем первую,
                // она будет ближайшей.
                panoramas[0],
                // Зададим направление взгляда, отличное от значения
                // по умолчанию.
                { direction: [256, 16] }
              );
            }
          },
          function (error) {
            // Если что-то пошло не так, сообщим об этом пользователю.
            alert(error.message);
          }
        );
      } else {
        let myMap = new map.Map(
            "ymap",
            {
              center: [53.83262304420013, 27.665218828754774],
              zoom: 7,
            },
            {
              searchControlProvider: "yandex#search",
            }
          ),
          objectManager = new map.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.

            geoObjectOpenBalloonOnClick: false,
            clusterOpenBalloonOnClick: false,
          });
        myMap.behaviors.disable("scrollZoom");
        // myMap.behaviors.disable("drag");

        map.borders
          .load("BY", {
            lang: "en",
            quality: 1,
          })
          .then(function (geojson) {
            var regions = map.geoQuery(geojson);

            for (let index = 0; index < props.ymapProps.length; index++) {
              if (props.ymapProps[index].color !== null) {
                regions
                  .search(`properties.name = '${props.ymapProps[index].name}'`)
                  .setOptions("fillColor", `${props.ymapProps[index].color}`);
                // .search(`properties.name = ${props.ymapProps[index].name}`)
                // .setOptions(`fillColor", ${props.ymapProps[index].color}`);
              }
            }
            // regions
            //   .search('properties.name = "Grodno Region"')
            //   .setOptions("fillColor", "rgb(255, 89, 89)");
            regions.addToMap(myMap);
          });

        objectManager.add({
          type: "FeatureCollection",
          features: props.features,
        });
        myMap.geoObjects.add(objectManager);

        function onObjectEvent(e) {
          var objectId = e.get("objectId");
          if (e.get("type") == "click") {
            let object = e.get("target");
            myMap.geoObjects.remove(object);
            myMap.destroy();

            props.clickHandler(objectId);
            // // Метод setObjectOptions позволяет задавать опции объекта "на лету".
            // objectManager.objects.setObjectOptions(objectId, {
            //   preset: "islands#yellowIcon",
            // });
          } else {
            // objectManager.objects.setObjectOptions(objectId, {
            //   preset: "islands#blueIcon",
            // });
          }
        }

        objectManager.objects.events.add(["click"], onObjectEvent);
      }
    })
    .catch((error) => console.log("Failed to load Yandex Maps", error));
};
