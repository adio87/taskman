<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('auth/login', 'Auth\AuthController@login');
Route::post('auth/register', 'Auth\AuthController@register');

Route::post('auth/password/email', 'Auth\PasswordResetController@sendResetLinkEmail');
Route::get('auth/password/verify', 'Auth\PasswordResetController@verify');
Route::post('auth/password/reset', 'Auth\PasswordResetController@reset');

Route::post('auth/password/reset-from-dashboard', 'Auth\PasswordResetController@resetFromDashboard');

//Pusher auth
Route::post('pusher/auth', 'PusherController@auth');


//protected API routes with JWT (must be logged in)
Route::get('/user', 'UserController@user');

//  - GET     /user/invite      @invite       - invite user to list
Route::get('/user/invite', 'UserController@invite');

//  - DELETE  /user/invite/{id} @deleteMember - delete member
Route::delete('/user/invite/{id}', 'UserController@deleteMember');

// ----------------------------------------- LISTS ROUTES ---------------------------------------

//  - POST    /api/lists/order     @order   - order list
Route::post('lists/order', 'ListsController@order');

//   - GET    /api/lists           @index   - get all lists
//   - GET    /api/lists/create    @create
//   - POST   /api/lists           @store   - store lists
//   - GET    /api/lists/{slug}    @show    - get list by slug
//   - PATCH  /api/lists/{id}      @update  - update lists by id
//   - DELETE /api/lists/{id}      @destroy - delete the lists by id
Route::resource('lists', 'ListsController');

// ----------------------------------------- TASKS ROUTES ---------------------------------------

//  - POST    /api/tasks/order   @order   - order list
Route::post('tasks/order', 'TasksController@order');
//  - GET     /api/tasks/check/{slug}   @order   - order list
Route::post('tasks/check/{slug}', 'TasksController@check');

//   - GET    /api/tasks         @index   - get all tasks
//   - GET    /api/tasks/create  @create
//   - POST   /api/tasks         @store   - store tasks
//   - GET    /api/tasks/{slug}  @show    - get task by slug
//   - PATCH  /api/tasks/{slug}  @update  - update tasks by slug
//   - DELETE /api/tasks/{id}    @destroy - delete the tasks by id
Route::resource('tasks', 'TasksController');

// ---------------------------------- PREDEFINED TASKS ROUTES ------------------------------------

//   - GET    /api/predefined         @index   - get all predefined tasks
//   - GET    /api/predefined/create  @create
//   - POST   /api/predefined         @store   - store tasks
//   - GET    /api/predefined/{slug}  @show    - get task by slug
//   - PATCH  /api/predefined/{slug}  @update  - update tasks by slug
//   - DELETE /api/predefined/{id}    @destroy - delete the tasks by id
Route::resource('predefined', 'PredefinedController');

//   - DELETE /api/predefined/list/{id} @destroyPredefined
Route::delete('predefined/list/{id}', 'ListsController@destroyPredefined');

// --------------------------------------- SUBFOLDERS ROUTES --------------------------------------

//   - POST   /api/subfolders         @store   - store subfolders
//   - PATCH  /api/subfolders/{id}    @update  - update subfolders by id
//   - DELETE /api/subfolders/{id}    @destroy - delete the subfolders by id
Route::resource('subfolders', 'SubfoldersController');

// ------------------------------------------ SEARCH ROUTES ---------------------------------------

//   - GET    /api/search/users       @users   - search results for users
Route::get('search/users', 'SearchController@users');
//   - GET    /api/search/{query}     @index   - search results for query
Route::get('search/{query}', 'SearchController@index');

// --------------------------------------- EXPORT/IMPORT ROUTES -----------------------------------

//   - GET    /api/export/{id}

Route::get('export/{id}', 'ExportImportController@export');
Route::post('import', 'ExportImportController@import');

// ------------------------------------------ TAGS ROUTES ---------------------------------------

//   - GET    /api/tags               @index -
//   - POST   /api/tags               @store -
//   - GET    /api/tags/{id}          @show  -
Route::post('tags/task', 'TagsController@taskAdd');
Route::delete('tags/task/{id}', 'TagsController@taskDestroy');
Route::resource('tags', 'TagsController');
