// inside out project STEP-502

//$("body").prepend('<div class=text-white style=position:fixed;top:0;bottom:0;width:100%;z-index:99999999;padding-top:12%;background-color:rgba(87,87,87,.95);" id="cover-page"><div id="cover-page-con" class="container text-center"style="opacity:100%;"><img alt="Web Competition 2018"class="img-fluid rounded-circle"src="https://www.racc.edu/sites/default/files/logo_1.png"><h1>Web Competition 2018</h1><p class=lead>...inspired innovative technology leader & follower.<p class=lead style=font-size:80%><i class="fa-1x fa-cog fa-spin fas"></i> we are preparing your experiance now...</div></div>');

var parentPageID = 1841;
var targetDomain = 'raccreallife.com';
//var menuPath = 'https://'+targetDomain+'/wp-json/wp-api-menus/v2/menus/66';
var eventsPath = 'https://' + targetDomain + '/wp-json/tribe/events/v1/events/?categories=68';
var defaultHomePage = 1808;

window.onload = getContent();

function getContent() {

    $.ajax({
        method: 'GET',
        url: eventsPath,
        dataType: 'json',
        success: function (data) {

            var className = '';
            let topTabs = '';
            let tabContent = '';
            var isHomeTab = 'active';
            var learningSessionsList = '';

            data.events.forEach(function (item) {

                topTabs = topTabs + '<li  class="' + isHomeTab + '""> <a href="#' + item.id + '">' + item.start_date_details.month + '-' + item.start_date_details.day + '</a> </li>';
                
                tabContent = tabContent + '<div class="tab-pane ' + isHomeTab + '" id="' + item.id + '">' + item.description + '<div class="well"><div class="row"><div class="col-md-6"><strong>Location:</strong> ' + item.venue.venue + '</div><div class="col-md-6"><strong>Date & Time:</strong> ' + item.start_date + '</div></div></div></div>';
                
                isHomeTab = (isHomeTab === 'active') ? '' : '';
                
                learningSessionsList = learningSessionsList + '<div class="lessonListItem"><div><strong>' + item.title + '</strong></div>' + item.description + '<div class="row" style="margin-left:5px"><div class="col-md-6" style="padding: 6px;"><strong>Location:</strong> ' + item.venue.venue + '</div><div class="col-md-6" style="padding: 6px;"><strong>Date & Time:</strong> ' + item.start_date + '</div></div><div><hr></div>';
                
                
            });
            
            learningSessionsList = learningSessionsList.replace(/col-md-6/g, "col-md-12");

            $("#sessionTabs").html(topTabs);
            $(".tab-content").html(tabContent);
            $("#sessionsModal .modal-body").html('<div id="lessonListItems">'+learningSessionsList+'</div>');
           // $( "#lessonListItems > .row.col-md-6" ).removeClass( "col-md-6" );
            $('ul.nav.nav-tabs  a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            (function ($) {
                // Test for making sure event are maintained
                $('.js-alert-test').click(function () {
                    alert('Button Clicked: Event was maintained');
                });
                fakewaffle.responsiveTabs(['xs', 'sm']);
            })(jQuery);

            
            $('#printLessonItemsBtn').click(function(e){
                printElement('#sessionsModal .modal-body');
            });


        },
        error: function () {
            console.log('bad');
        }
    });

}

function printElement(e) {
  var ifr = document.createElement('iframe');
  ifr.style='height: 0px; width: 0px; position: absolute'
  document.body.appendChild(ifr);

  $(e).clone().appendTo(ifr.contentDocument.body);
  ifr.contentWindow.print();

  ifr.parentElement.removeChild(ifr);
}




