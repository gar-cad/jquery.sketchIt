# jquery.sketchIt

A simple jquery plugin that enables simple drawing functionality on an automatically generated html5 canvas

### Prerequisites

jquery 2.0.1, jquery mobile (to use the virtual mouse bindings)

### Set up

Install the plugin, and use the following source code as an example. Basic use (using the default syntax), more examples can be found in the demo folder.

##### HTML
```
<div id="ex1"></div>
```

##### javascript
```
<script src="http://code.jquery.com/jquery-2.0.1.min.js"></script>
<script src="src/jquery-ui.min.js"></script>
<script src="src/jquery.mobile.custom.min.js"></script>
<script src="src/jquery.sketchIt.min.js"></script>
<script>
    $(function () {
        $('#ex1').sketchIt();
    });
</script>
```

##### CSS
```
<style>
    #ex1 {
        height: 200px;
    }
</style>
```

## Examples

View the examples in the demo folder. 

## Author

* **Gareth Cadwaladr** - *Initial work* - [gar-cad](https://github.com/gar-cad)

See also the list of [contributors](https://github.com/gar-cad/jquery.dataTree/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.MD) file for details
