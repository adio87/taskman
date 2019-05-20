<!doctype html>
<html ng-app="app" ng-strict-di>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{env('APP_NAME')}}</title>

    <meta name="theme-color" content="#0690B7">

    <link rel="manifest" href="manifest.json">

    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->
    <script>
        window.Taskman = {
            config: {
                pusherKey: '{{env("PUSHER_APP_KEY")}}'
            }
        }
    </script>

    <style><?php require(public_path("css/critical.css")) ?></style>

</head>
<body>

    <app-shell>
        <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
    </app-shell>

    <div class="pusher">
        <app-root></app-root>
    </div>

    <pomodore-timer></pomodore-timer>


    <script>
    (function(){
        var link = document.createElement("link");
        link.href = "{!! elixir('css/final.css') !!}";
        link.type = "text/css";
        link.rel = "stylesheet";
        document.body.appendChild(link);
    })();
    </script>

    <script src="{!! elixir('js/final.js') !!}" async></script>

</body>
</html>
