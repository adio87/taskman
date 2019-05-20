<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{$subject}}</title>
</head>
<body>
<h1>Please accept this invitation by clicking on this <a href="{{url('/check-token/' . $post['member']->id . '/' . $post['token'])}}">link</a></h1>
{{--<ul>--}}
    {{--@foreach($post as $key => $p)--}}
        {{--<li>{{strtoupper($key) . ': ' . $p}}</li>--}}
    {{--@endforeach--}}
{{--</ul>--}}
</body>
</html>