$(function() {

    //GET AUTHORS IN TABLE

    $.get('http://localhost/BOOKSTORE/rest/rest.php/author')
        .done(function(data) {

            if(data.success && data.success.length > 0) {
                data.success.forEach(function(e) {
                    createNewAuthor(e)
                })
            }
        });

    //ADD NEW AUTHOR

    $('#authorAdd').on('submit',function(event) {
        event.preventDefault()
            $.post('http://localhost/BOOKSTORE/rest/rest.php/author', $(this).serialize())
                .done(function (data) {
                    if (data.success && data.success.length > 0) {
                        createNewAuthor(data.success[0])
                        showModal('You have added an author !', '')
                    }
                }).fail(function(){
                    showModal('WARNING !','Adding an author failed')
            })

    })

    //REMOVE BUTTON

    $('#authorsList').on('click', '.btn-author-remove', function () {
        var $me = this
        $.ajax({
            url: "http://localhost/BOOKSTORE/rest/rest.php/author/" + $(this).data('id'),
            type: "DELETE",
            dataType: "json"
        }).done(function (data) {
            if (data.success == 'deleted') {
                showModal('WARNING !', 'You have removed a book !');
                $($me).parent().parent().parent().remove()
                showModal('You have removed an author','')
            }
        }).fail(function() {
            showModal('WARNING !','Remove failed');
        })
    })

    //SELECT FORM

    $('#authorEditSelect').on('change', function () {
        var authorId = $(this).val()
        if (!authorId) {
            $('#authorEdit').css('display', 'none')
        } else {
            $.get('http://localhost/BOOKSTORE/rest/rest.php/author/' + authorId)
                .done(function (data) {
                    if (data.success && data.success.length > 0) {
                        data.success.forEach(function (elm) {
                            $('#authorEdit').children().eq(0).attr('value', elm.id)
                            $('#authorEdit').children().eq(2).find('#name').val(elm.name)
                            $('#authorEdit').children().eq(3).find('#surname').val(elm.surname)
                        })
                    }
                })
            $('#authorEdit').css('display', 'block')

            // SAVING CHANGE

            $('#authorEdit').find('button').on('click', function (event) {
                event.preventDefault()

                var idChange = $('#authorEdit').children().eq(0).val()
                var authorEdit = $('#authorEdit').serialize()

                $.ajax({
                    url: "http://localhost/BOOKSTORE/rest/rest.php/author/" + idChange,
                    type: "PATCH",
                    data: authorEdit

                }).done(function (data) {
                    if (data.success && data.success.length > 0) {
                        $('#authorEdit').css('display', 'none')
                        data.success.forEach(function (e) {
                            $('#authorEditSelect').find('option[value="' + e.id + '"]').attr("selected", "selected").text(e.name + " " + e.surname)
                            $('div').find('button[data-id="' + e.id + '"]').eq(0).parent().find('span').text(e.name + " " + e.surname)
                        })
                        showModal("EDITION COMPLETED !",'');
                    }
                })
            })
        }


    })

    // DISCOVER AUTHOR'S BOOK

    $('#authorsList').on('click', '.btn-author-books', function () {
        $('.authorBooksList li').remove()
        $('.authorBooksList').css('display', 'none')
        var authorId = $(this).data('id')
        let $ulAuthorsBooks = $('.authorBooksList').css('display', 'none')
        let $listBooks = $('<li>', {class: 'author-books'})

        $.get('http://localhost/BOOKSTORE/rest/rest.php/author/' + authorId)
            .done(function (data) {
                if (data.success && data.success.length > 0) {
                    data.success.forEach(function (e) {
                        e.books.forEach(function (book) {
                            $listBooks.text(book.title)
                            $ulAuthorsBooks.append($listBooks)

                        })
                    })
                }
            })
        $(this).parent().parent().find('.authorBooksList').toggle()
    })

})

let createNewAuthor = (author) => {


    let $authorsList = $('#authorsList')
    let $li = $('<li>', {class: 'list-group-item'})
    let $panel = $('<div>', {class: 'panel panel-default'})
    let $heading = $('<div>', {class: 'panel-heading'})
    let $authorName = $('<span>', {class: 'authorTitle'})
    let $buttonAuthorRemove = $('<button class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button>')
    let $buttonShowBooks = $('<button class="btn btn-primary pull-right btn-xs btn-author-books"><i class="fa fa-book"></i></button>')
    let $authorBooks = $('<ul>', {class: 'authorBooksList'})

    $authorName.text(author.name + " " + author.surname)
    $buttonAuthorRemove.attr('data-id', author.id)
    $buttonShowBooks.attr('data-id', author.id)

    $heading.append($authorName).append($buttonAuthorRemove).append($buttonShowBooks)
    $panel.append($heading).append($authorBooks)
    $li.append($panel)
    $authorsList.append($li)

    // SELECT FORM
    let $option = $('<option>', {value: author.id}).text(author.name + " " + author.surname)
    $('#authorEditSelect').append($option)


}