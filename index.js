$(document).ready(function(){

    // global variable that save value of the date
    let tempGlobal;

    $.ajax({
        type: "GET",
        url:"http://bialash.mysoft.jce.ac.il/ex1/source/get_current_date.php", 
        success: function(result){
            console.log(result);
            tempGlobal = result;
        $('time').text(result);
      },
     error: function (request){ alert(request.statusText)}
    
    });

    $.fn.callHtml = function(data,index){
        let txt = `<b>Animal type:</b> ${data[index].animal_type} <br>
            <b>Diet:</b> ${data[index].diet} <br>
            <b>Lifespan:</b> ${data[index].lifespan} <br>
            <b>Length range:</b> ${(data[index].length_min*0.3048).toFixed(2)}m - ${(data[index].length_max*0.3048).toFixed(2)}m <br>
            <b>Weight range:</b> ${(data[index].weight_min*0.45359237).toFixed(2)}kg - ${(data[index].weight_max*0.45359237).toFixed(2)}kg <br>
            `

            // insert the details to grid item.
            document.getElementById(`index-${index}`).innerHTML = txt;
    }

    /* this is the function that i work on and call it
    in every button (4), (8) and (10)*/
    $.fn.myFunction = function(data,numberOfAnimals){ 

        // make a loop to make copyes for grind items 
        // and print all the animals in the screen in grind item.
        for(let i = 0 ; i<numberOfAnimals ; i++){

            //make grind item for every animal.
            let txt1 = `<div class="grid-item" id="grid-${i}">
                           <label for="image-id-${i}">${data[i].name}</label><hr>
                            <input class="animals-images" id="image-id-${i}" type="Image" src="${data[i].image_link}"> 
                            <p id="index-${i}"></p> 
                        </div>`;

            // insert this grid in the grid container.
            $(".Animals-grid").append(txt1);
        }

        // when click the image show the details of the clicked animal image.
        $(".animals-images").click(function(){
            let x = this.id;
            let index = parseInt(x.charAt(x.length - 1));

            const currTime = new Date();
            let arr = [currTime.getDate() , currTime.getMonth() + 1 , currTime.getFullYear()];
            const temp = `${currTime.getFullYear()}0${currTime.getMonth()+1}${currTime.getDate()}`;
            let arr2 = [currTime.getDate() , currTime.getMonth() + 1 , currTime.getFullYear()-7];
            const beforeWeek = `${currTime.getFullYear()}0${currTime.getMonth()+1}${currTime.getDate()-7}`;

            $.fn.callHtml(data,index);

            let ourRequest = new XMLHttpRequest();
            ourRequest.open('GET', `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${data[index].name}/daily/${beforeWeek}/${temp}`);

            ourRequest.onload = function(){
                let ourData  = JSON.parse(ourRequest.responseText);
                const element = document.getElementById(`index-${index}`);
                element.append(`Views: `);

                if(!ourData.items){
                    throw 'No body visit this page in this week!';
                }
                else{
                    for(let y= 0; y< ourData.items.length-1 ;y++){
                        element.append(`${ourData.items[y].views} - `);
                    }
                    element.append(`${ourData.items[ourData.items.length-1].views}`);
                }
            }

            ourRequest.send();

        });
    }


    $(".but-4").click(function(){

        // use .empty to not repeat what inside the grid.
        $(".Animals-grid").empty();
        
        // call api url
        const apiUrl = 'https://zoo-animal-api.herokuapp.com/animals/rand/4'

        async function getData(){
            // save the response of the api.
            const response = await fetch(apiUrl);
            // make data egual to all json tables.
            const data = await response.json();

            // call the function.
            $.fn.myFunction(data,4);
        }

        getData();
        
    });


    $(".but-8").click(function(){

        $(".Animals-grid").empty();

        const apiUrl = 'https://zoo-animal-api.herokuapp.com/animals/rand/8'

        async function getData(){
            const response = await fetch(apiUrl);
            const data = await response.json();

            $.fn.myFunction(data,8);
        }

        getData();
        
    });


    $(".but-10").click(function(){

        $(".Animals-grid").empty();

        const apiUrl = 'https://zoo-animal-api.herokuapp.com/animals/rand/10'

        async function getData(){
            const response = await fetch(apiUrl);
            const data = await response.json();

            $.fn.myFunction(data,10);
        }

        getData();
        
    });

  });

