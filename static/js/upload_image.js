Dropzone.options.myAwesomeDropzone = {
      paramName: "image_file",
      maxFilesize: 2,
      autoProcessQueue : false,
      init : function() {
        var myDropzone = this;
        $("#submit-all").click(function() {
          var error_list = [];
          if(!$('.dropzone input[name="title"]').val()) {
            error_list.push('Image title required !');
          } 
          if(error_list.length) {
            show_alert(error_list.join('\n'));
            return false;
          }
          myDropzone.processQueue();
        });
      },
      success: function(data) {
          reset_form();
          get_image_data();
          show_alert('Image Successfully Uploaded !');
      }
};

var cp = 1;
function get_image_data() {
  var qp = {
    'cp': cp,
  }
  if($('.search_str').val()) {
    qp['search_str'] = $('.search_str').val(); 
  }
  $.getJSON('get', qp, function(data) {
    if(data.data.length) {
      $('.no_data').hide();
      $('.image_master').remove();
      $.each(data.data, function(i,v){
        create_image_block(v);
      }); 
    } else {
      $('.no_data').show();
      $('.image_master').remove();
    }
  });
}


function create_image_block(data) {
  var html = '<div class="col-md-4 image_master" data-image_id="'+ data.id +
        '" data-title="'+ data.title+'" data-caption="'+ data.caption +'" data-image_file="'+ data.image_file +'">' +
      '<div class="image_area" style="background: url(/'+ data.image_file +')">' +
        '<div class="action_btns pull-right">' +
          '<span class="glyphicon glyphicon-heart like"></span>' +
          '<span class="glyphicon glyphicon-share-alt share"></span>' +
          '<span class="glyphicon glyphicon-trash delete"></span>' +
        '</div>' +
        '<div class="image_text">' +
          data.title
        '</div>' + 
      '</div>' +
    '</div>'; 
  $('.image_data_area').append(html);
  $('.no_data').hide();
}

function delete_image() {
  $('.image_data_area').on('click', '.delete', function() {
    var x = confirm('Are you sure you want to delete this image ?');
    if(!x) { return false; }
    var image_id = $(this).parents('.image_master').data('image_id');
    var image_master = $(this).parents('.image_master');
    $.post('delete', {'image_id': image_id}, function(data) {
      data = JSON.parse(data);
      if(data.status_code == 200) {
        show_alert('Image Successfully deleted !');
        image_master.remove(); 
      }
    });
  });
}

function like_image() {
  $('.image_data_area').on('click', '.like', function() {
    var image_id = $(this).parents('.image_master').data('image_id');
    var image_master = $(this).parents('.image_master');
    $.post('like', {'image_id': image_id}, function(data) {
      data = JSON.parse(data);
      if(data.status_code == 200) {
        show_alert('Image Successfully Liked !');
        image_master.find('.like').addClass('liked');
      }
    });
  });
}

function share_image() {
  $('.image_data_area').on('click', '.share', function() {
    var data = $(this).parents('.image_master').data();
    FB.ui({
      method: 'share',
      href: location.origin,
      caption: data.title,
      description: data.caption,
      picture: location.origin + '/' + data.image_file
    }, function(response){ });
  });
}

function search_image() {
  $('.search_image_btn').click(function() {
    get_image_data();
    $('.search_str').val('');
  });
}


function reset_form() {
  $('.dz-preview, .dz-image-preview').remove();
  $('.dropzone').removeClass('dz-started');
  $('.dropzone input[type="text"]').val('');
}


function show_alert(text) {
  $('.custom_alert').html(text);
  $('.custom_alert').addClass('show');
  setTimeout(function() {
    $('.custom_alert').removeClass('show');
  }, 4000);
}

$(document).ready(function() {
  $('.main_area').css('height', ($(window).height() - $('.main_area').offset().top -20) + 'px');
  get_image_data();
  delete_image();
  like_image();
  share_image();
  search_image();
});
