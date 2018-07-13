$(function() {

    var $bookAddForm = $('#bookAdd')

    //GET BOOKS IN TABLE

    $.get('http://localhost/BOOKSTORE/rest/rest.php/book')
        .done(function (data) {

            if (data.success && data.success.length > 0) {
                data.success.forEach(function (elm) {
                    createNewBook(elm)
                })
            }

        })

    //ADD NEW BOOK

    $bookAddForm.on('submit', function (event) {
        event.preventDefault()
        var checkTitle = $('#bookAdd').children().eq(1).find('#title').val()
        if (!checkTitle) {
            showModal("WARNING !", "Title is empty !");
        } else {
            $.post('http://localhost/BOOKSTORE/rest/rest.php/book', $(this).serialize())
                .done(function (data) {
                    if (data.success && data.success.length > 0) {
                        createNewBook(data.success[0])
                        showModal('You have added a book !', '')
                    }
                })
        }
    })


    //SHOW DESCRIPTION

    $('#booksList').on('click', '.btn-book-show-description', function () {
        var id = $(this).data('id')
        $.get('http://localhost/BOOKSTORE/rest/rest.php/book/' + id)
            .done(function (data) {
                var data = data.success[0].description
                showModal('DESCRIPTION', data)
            })
    })

    //REMOVE BUTTON

    $('#booksList').on('click', '.btn-book-remove', function () {
        var $me = this
        $.ajax({
            url: "http://localhost/BOOKSTORE/rest/rest.php/book/" + $(this).data('id'),
            type: "DELETE"
        }).done(function (data) {
            if (data.success == 'deleted') {
                showModal('WARNING !', 'You have removed a book !');
                $($me).parent().parent().parent().remove()
            }
        })
    })

    //BOOK EDIT FORM

    $('#bookEditSelect').on('change',function() {

        if(!this) {
            $('#bookEdit').css('display','none')
        } else {
            $.get('http://localhost/BOOKSTORE/rest/rest.php/book/' + $(this).data('id'))
                .done(function(data){
                    if(data.succes && data.succes.length >0) {
                        data.success.forEach(function (e) {
                            $('#bookEdit').children().eq(0).attr('value', e.id)
                            $('#bookEdit').children().eq(2).find('#title').val(e.title)
                            $('#author_id_edit').find('option[value="' + e.author['id'] + '"]').attr("selected", "selected")
                            $('#bookEdit').children().eq(4).find('#description').val(e.description)
                        })
                    }
                })
            $('#bookEdit').css('display','block')

            //SAVING CHANGE

            $('#bookEdit').find('button').on('click',function(event){
                var idChange = $('#bookEdit').children().eq(0).val()
                var bookChange = $('#bookEdit').serialize()

                $.ajax({
                    url: "http://localhost/BOOKSTORE/rest/rest.php/book/" + idChange,
                    type: "PATCH",
                    data: bookChange

                }).done(function (data) {
                    if (data.success && data.success.length > 0) {
                        $('#bookEdit').css('display', 'none')
                        data.success.forEach(function (e) {
                            $('#bookEditSelect').find('option[value="' + e.id + '"]').attr("selected", "selected").text(e.title)
                            $('div').find('button[data-id="' + e.id + '"]').eq(0).parent().find('span').text(e.title + " (" + e.author['name'] + " " + e.author['surname'] + ")")
                        })
                        showModal("You have made a change", '');
                    }
                })
            })
        }
    })

})


let createNewBook = (book) => {
    let $booksList = $('#booksList')
    let $li = $('<li>', {class: 'list-group-item'})
    let $panel = $('<div>', {class: 'panel panel-default'})
    let $heading = $('<div>', {class: 'panel-heading'})
    let $bookTitle = $('<span>', {class: 'bookTitle'})
    let $buttonRemove = $('<button class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i></button>')
    let $buttonShowDescription = $('<button class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i></button>')
    let $bookDescription = $('<span>', {class: 'panel-body book-description'})

    $bookTitle.text(book.title)
    $bookDescription.text(book.description)
    $buttonRemove.attr('data-id', book.id)
    $buttonShowDescription.attr('data-id', book.id)

    $heading.append($bookTitle).append($buttonRemove).append($buttonShowDescription)
    $panel.append($heading).append($bookDescription)
    $li.append($panel)
    $booksList.append($li)

    // BOOKS TO SELECT FORM
    let $optionBooks = $('<option>', {value: book.id}).text(book.title)
    $('#bookEditSelect').append($optionBooks)
    // AUTHORS IN ADD AND EDIT FORM
    let $optionAuthors = $('<option>', {value: book.author['id']}).text(book.author['name'] + " " + book.author['surname'])
    let $optionAuthorsEdit = $('<option>', {value: book.author['id']}).text(book.author['name'] + " " + book.author['surname'])
    $('#author_id_edit').append($optionAuthorsEdit)
    $('#author_id').append($optionAuthors)

}