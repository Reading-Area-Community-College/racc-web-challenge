var parentPageID = 1841;
var targetDomain = 'raccreallife.com';
//var menuPath = 'https://'+targetDomain+'/wp-json/wp-api-menus/v2/menus/66';
var eventsPath = 'https://' + targetDomain + '/wp-json/tribe/events/v1/events/?categories=68&start_date=2018-10-01%2019:59:00&per_page=100';
var pagesPath = 'https://' + targetDomain + '/wp-json/wp/v2/pages';
var defaultHomePage = 1808;

window.onload = getContent();

$(document).ready(function() {
  // Initialize Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#home']").on('click', function(event) {
    if (this.hash.includes("#")) {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function() {

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    }
  });
     
     popup.init();
     
})


function getContent() {

  $.ajax({
    method: 'GET',
    url: eventsPath,
    dataType: 'json',
    success: function(data) {

      var className = '';
      let topTabs = '';
      let tabContent = '';
      var isHomeTab = 'active';
      var learningscheduleList = '';

      data.events.forEach(function(item) {

        var options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        let date = new Date(item.start_date);
        var startDate = new Date(item.start_date);
        var endDate = new Date(item.end_date);
        let sTime = timeFormat(startDate.getHours(), startDate.getMinutes());
        let eTime = timeFormat(endDate.getHours(), endDate.getMinutes());
        let timeSlots = sTime + ' to ' + eTime;
        let tabIcon = 'users';
        let theVenue = '';

        item.tags.forEach(function(item) {
          if (item.name == 'scrum') {
            timeSlots = '8:30 AM to 9:30 AM & 12:30 PM to 1:30 PM';
          }
        });

        if (item.venue.venue === 'WebEx') {
          tabIcon = 'chalkboard-teacher';
          theVenue = 'WebEx<br /> Link will be provided the day of the meeting.';
        } else {
          theVenue = item.venue.venue + '<br />' + item.venue.address + ', ' + item.venue.city + ' ' + item.venue.zip;
        }


        topTabs = topTabs + '<li  class="' + isHomeTab + '""> <a href="#' + item.id + '"> <i class="fas fa-' + tabIcon + '"></i>  ' + item.start_date_details.month + '-' + item.start_date_details.day + '</a> </li>';

        tabContent = tabContent + '<div class="tab-pane ' + isHomeTab + '" id="' + item.id + '">' + item.description + '<div class="well"><div class="row"><div class="col-md-6"><strong>Location:</strong> ' + theVenue + '</div><div class="col-md-6"><strong>Date & Time:</strong> ' + startDate.toLocaleDateString("en-US", options) + ' <br /> ' + timeSlots + '</div></div></div></div>';

        isHomeTab = (isHomeTab === 'active') ? '' : '';

        learningscheduleList = learningscheduleList + '<div class="lessonListItem"><div><strong>' + item.title + '</strong></div>' + item.description + '<div class="row" style="margin-left:5px"><div class="col-md-6" style="padding: 6px;"><strong>Location:</strong> ' + theVenue + '</div><div class="col-md-6" style="padding: 6px;"><strong>Date & Time:</strong> ' + startDate.toLocaleDateString("en-US", options) + ' | ' + timeSlots + '</div></div><div><hr></div>';


      });

      learningscheduleList = learningscheduleList.replace(/col-md-6/g, "col-md-12");

      $("#sessionTabs").html(topTabs);
      $(".tab-content").html(tabContent);
      $("#scheduleModal .modal-body").html('<div id="lessonListItems">' + learningscheduleList + '</div>');
      // $( "#lessonListItems > .row.col-md-6" ).removeClass( "col-md-6" );
      $('ul.nav.nav-tabs  a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
      });

      (function($) {
        // Test for making sure event are maintained
        $('.js-alert-test').click(function() {
          alert('Button Clicked: Event was maintained');
        });
        fakewaffle.responsiveTabs(['xs', 'sm']);
      })(jQuery);


      $('#printLessonItemsBtn01, #printLessonItemsBtn02').click(function(e) {
        printElement('#scheduleModal .modal-body');
      });

      $('#printDayScheduleModalBtn').click(function(e) {
        printElement('#dayScheduleModal .modal-body');
      });

      reAdjust();

    },
    error: function() {
      //console.log('bad');
    }
  });

  var hidWidth;
  var scrollBarWidths = 100;

  var widthOfList = function() {
    var itemsWidth = 0;
    $('.list li').each(function() {
      var itemWidth = $(this).outerWidth();
      itemsWidth += itemWidth;
    });
    return itemsWidth;
  };

  var widthOfHidden = function() {
    return (($('.wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
  };

  var getLeftPosi = function() {
    return $('.list').position().left;
  };

  var reAdjust = function() {
    if (($('.wrapper').outerWidth()) < widthOfList()) {
      $('.scroller-right').show();
    } else {
      $('.scroller-right').hide();
    }

    if (getLeftPosi() < 0) {
      $('.scroller-left').show();
    } else {
      $('.item').animate({
        left: "-=" + getLeftPosi() + "px"
      }, 'slow');
      $('.scroller-left').hide();
    }
  }

  reAdjust();

  $(window).on('resize', function(e) {
    reAdjust();
  });

  $('.scroller-right').click(function() {

    $('.scroller-left').fadeIn('slow');
    $('.scroller-right').fadeOut('slow');

    $('.list').animate({
      left: "+=" + widthOfHidden() + "px"
    }, 'slow', function() {

    });
  });

  $('.scroller-left').click(function() {

    $('.scroller-right').fadeIn('slow');
    $('.scroller-left').fadeOut('slow');

    $('.list').animate({
      left: "-=" + getLeftPosi() + "px"
    }, 'slow', function() {

    });
  });



}

function printElement(e) {
  var ifr = document.createElement('iframe');
  ifr.style = 'height: 0px; width: 0px; position: absolute'
  document.body.appendChild(ifr);

  $(e).clone().appendTo(ifr.contentDocument.body);
  ifr.contentWindow.print();

  ifr.parentElement.removeChild(ifr);
}


function timeFormat(h, m = '00') {
  if (m.toString.length == 1) {
    m = "0" + m;
  }
  h = (h <= 12) ? h + ':' + m + ' AM' : h - 12 + ':' + m + ' PM';
  return h;
}



$("#btnSubmitContact").on("click", function(event) {

  $('#ldrMsgEmail').html('checking form information');
  $('#ldrDivEmail').show();

  var formData = {
    'name': $('input[name=name]').val(),
    'email': $('input[name=email]').val(),
    'message': $('#message').val()
  };

  if (formData.name == "") {
    $('#fbName').html('You must enter a name to conact us.');
    $('#ldrDivEmail').hide();
    Event.preventDefault;
  } else {
    $('#fbName').html('');
  }

  if (formData.email == "") {
    $('#fbEmail').html('You must enter an email address to conact us.');
    $('#ldrDivEmail').hide();
    Event.preventDefault;
  } else {
    $('#fbEmail').html('');
  }

  if (formData.message == "") {
    $('#fbMessage').html('You must enter a message to conact us.');
    $('#ldrDivEmail').hide();
    Event.preventDefault;
  } else {
    $('#fbMessage').html('');
  }

  // process the form
  $('#ldrMsgEmail').html('sending your email now');
  $.ajax({
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: 'https://raccwebchallenge.com/process-email-form.php', // the url where we want to POST
      data: formData, // our data object
      dataType: 'json', // what type of data do we expect back from the server
      encode: true
    })

    // using the done promise callback
    .done(function(data) {
      $('#ldrMsgEmail').html('Your message has been sent!');
      // log data to the console so we can see
      //console.log(data);

      // here we will handle errors and validation messages
    })
    .fail(function(event) {
      alert("Error: " + Error(event) + "\nStatus: " + status);
    })
    .always(function(data) {
      //alert( "Every Time " + status +" - "+data );
      $('#ldrMsgEmail').html('');
      $('#ldrDivEmail').hide();
    });

  // stop the form from submitting the normal way and refreshing the page
  event.preventDefault();
});




$(document).ready(function() {
  $('.gmap').click(function(e) {
    e.preventDefault();
    console.log(e.currentTarget.innerHTML);
    console.log(e);
    if (e.currentTarget.innerHTML == '10 South Second Street, Reading, PA 19602') {
      $('#lgModal .modal-body').html('<iframe src="' + e.currentTarget.href + '" width="100%" height="500px;"></iframe>');
    }
    $('#lgModal .modal-header').html(e.currentTarget.innerHTML);
    $('#lgModal').modal('show');
    var divId = 'summary' + $(this).attr('id');

    document.getElementById(divId).className = ''; /* or $('#'+divid).removeAttr('class'); */

  });
  $('.team-info-bnt').click(function(e) {
    e.preventDefault();
    console.log($(this).siblings("h6")[0].innerHTML);
    $('#teamModal .modal-header').html('<h1>' + $(this).siblings("h6")[0].innerHTML + '</h1><h5>' + $(this).siblings(".team-tag-line")[0].innerHTML + '</h5>');
       $('#teamModal .card-row').hide();
       console.log($(this).data("team"));
       let curTeam = '#teamModal .'+$(this).data("team");
       $(curTeam).show();
    $('#teamModal').modal('show');
  });
});

$(window).ready(function cardInfoUpdate() {
  $('.schedule-card').click(function(e) {

    let pgId = this.id.split("-");
    let schedHTML = $(".schedule-warp").html();

    //$(".schedule-warp").fadeOut(1000);

    $.ajax({
      method: 'GET',
      url: pagesPath + '/' + pgId[1],
      dataType: 'json',
      success: function(data) {
        $(".schedule-warp").html('<a class="infoBack" style="cursor:pointer;"><i class="far fa-arrow-alt-circle-left fa-2x"></i></a><h1>'+data.title.rendered+'</h1><div>'+data.content.rendered+'</div>');
        //$(".schedule-warp").fadeIn(1000);
        $(".schedule-warp .infoBack").click(function() {
          //$(".schedule-warp").fadeOut(1000);
          $(".schedule-warp").html(schedHTML);
        //  $(".schedule-warp").fadeIn(1000);
          cardInfoUpdate();
        });
      }
    });
  });
});

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-123539134-1');

$(".navbar-nav li a").click(function() {
  console.log("NAV CLICKED");
  console.log(this.id);
  ga('send', 'event', 'Page Clicks', 'Click to scroll', this.id);
});

    popup = {
  init: function(){
    $('figure').click(function(){
      popup.open($(this));
    });
    
    $(document).on('click', '.popup img', function(){
      return false;
    }).on('click', '.popup', function(){
      popup.close();
    })
  },
  open: function($figure) {
    $('.gallery').addClass('pop');
    $popup = $('<div class="popup" />').appendTo($('body'));
    $fig = $figure.clone().appendTo($('.popup'));
    $bg = $('<div class="bg" />').appendTo($('.popup'));
    $close = $('<div class="close"><svg><use xlink:href="#close"></use></svg></div>').appendTo($fig);
    $shadow = $('<div class="shadow" />').appendTo($fig);
    src = $('img', $fig).attr('src');
    $shadow.css({backgroundImage: 'url(' + src + ')'});
    $bg.css({backgroundImage: 'url(' + src + ')'});
    setTimeout(function(){
      $('.popup').addClass('pop');
    }, 10);
  },
  close: function(){
    $('.gallery, .popup').removeClass('pop');
    setTimeout(function(){
      $('.popup').remove()
    }, 100);
  }
}


