	<?php
	require_once  'vendor/autoload.php';
	$db = new mysqli('localhost','root','admin','todoanunciosdb');


	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Allow: GET, POST, OPTIONS, PUT, DELETE");
	$method = $_SERVER['REQUEST_METHOD'];
	if($method == "OPTIONS") {
		die();
	}
	$app = new \Slim\Slim();
	$app->get("/pruebas", function() use($app){
		echo "Hola gente aqui con Slim PHP";
	});

	//Método post para guardar anuncio en la BD

	$app->post('/anuncios', function() use($app, $db){
		$json = $app->request->post('json');
		$data = json_decode($json, true);
		if(!isset($data['titulo'])){
			$data['titulo']=null;
		}
		if(!isset($data['cuerpo'])){
			$data['cuerpo']=null;
		}
		if(!isset($data['precio'])){
			$data['precio']=null;
		}
		if(!isset($data['categoria'])){
			$data['categoria']=null;
		}
		if(!isset($data['autor'])){
			$data['autor']=null;
		}
		if(!isset($data['imagen'])){
			$data['imagen']=null;
		}
		$query = "INSERT INTO anuncios (titulo,cuerpo,precio,categoria,autor,imagen) VALUES(".
		"'{$data['titulo']}',".
		"'{$data['cuerpo']}',".
		"'{$data['precio']}',".
		"'{$data['categoria']}',".
		"'{$data['autor']}',".
		"'{$data['imagen']}'".
		");";
		$insert = $db->query($query);
		$result = array(
			'status' => 'error',
			'code' => 404,
			'message' => 'Anuncio NO se ha creado'
		);
		if($insert){
			$result = array(
				'status' => 'success',
				'code' => 200,
				'message' => 'Anuncio creado correctamente'
			);
		}
		echo json_encode($result);
	});

//Metodo para devolver el listado de anuncios guardados

	$app->get('/anuncios', function() use($db, $app){
		$sql = 'SELECT * FROM anuncios ORDER BY id DESC;';
		$query = $db->query($sql);
		$anuncios = array();
		while ($anuncio = $query->fetch_assoc()) {
			$anuncios[] = $anuncio;
		}
		$result = array(
			'status' => 'success',
			'code' => 200,
			'data' => $anuncios
		);
		echo json_encode($result);
	});

//Metodo para buscar un anuncio

	$app->get('/anuncio/:id', function($id) use($db, $app){
		$sql = 'SELECT * FROM anuncios WHERE id = '.$id;
		$query = $db->query($sql);
		$result = array(
			'status' => 'error',
			'code' => 404,
			'message' => 'Anuncio no disponible'
		);
		if($query->num_rows == 1){
			$anuncio = $query->fetch_assoc();
			$result = array(
				'status' => 'success',
				'code' => 200,
				'data' => $anuncio
			);
		}
		echo json_encode($result);
	});
//Metodo para borrar anuncio

	$app->get('/deleteAdd/:id', function($id) use($db, $app){
		$sql = 'DELETE FROM anuncios WHERE id = '.$id;
		$query = $db->query($sql);
		if($query){
			$result = array(
				'status' => 'success',
				'code' => 200,
				'message' => 'El anuncio se ha eliminado correctamente!!'
			);
		}else{
			$result = array(
				'status' => 'error',
				'code' => 404,
				'message' => 'El anuncio no se ha eliminado!!'
			);
		}
		echo json_encode($result);
	});
	
	//Metodo para actualizar el anuncio
	
	$app->post('/updateAdd/:id', function($id) use($db, $app){
		$json = $app->request->post('json');
		$data = json_decode($json, true);
		$sql = "UPDATE anuncios SET ".
		"titulo = '{$data["titulo"]}', ".
		"cuerpo = '{$data["cuerpo"]}', ".
		"precio = '{$data["precio"]}', ".
		"categoria = '{$data["categoria"]}' ";
		if(isset($data['imagen'])){
			$sql .= ", imagen = '{$data["imagen"]}' ";
		}
		$sql .= "WHERE id = {$id}";
		$query = $db->query($sql);

		if($query){
			$result = array(
				'status' => 'success',
				'code' => 200,
				'message' => 'El anuncio se ha actualizado correctamente!!'
			);
		}else{
			$result = array(
				'consulta' => $sql,
				'status' => 'error',
				'code' => 404,
				'message' => 'El anuncio no se ha actualizado!!'
			);
		}
		echo json_encode($result);
	});
	
	//Metodo para subir imagen de un anuncio
	
	$app->post('/upload-file', function() use($db, $app){
		$result = array(
			'status' 	=> 'error',
			'code'		=> 404,
			'message' 	=> 'El archivo no ha podido subirse'
		);

		if(isset($_FILES['uploads'])){
			$piramideUploader = new PiramideUploader();
			$upload = $piramideUploader->upload('image', "uploads", "uploads", array('image/jpeg', 'image/png', 'image/gif'));
			$file = $piramideUploader->getInfoFile();
			$file_name = $file['complete_name'];

			if(isset($upload) && $upload["uploaded"] == false){
				$result = array(
					'status' 	=> 'error',
					'code'		=> 404,
					'message' 	=> 'El archivo no ha podido subirse'
				);
			}else{
				$result = array(
					'status' 	=> 'success',
					'code'		=> 200,
					'message' 	=> 'El archivo se ha subido',
					'filename'  => $file_name
				);
			}
		}

		echo json_encode($result);
	});

//Método post para guardar comentario en la BD ********************************************************************************************************************************

	$app->post('/comentarios', function() use($app, $db){
		$json = $app->request->post('json');
		$data = json_decode($json, true);
		if(!isset($data['anuncio'])){
			$data['anuncio']=null;
			echo"No hay anuncio referido, este comentario no se creará";
		}
		if(!isset($data['cuerpo'])){
			$data['cuerpo']=null;
			echo"Cuerpo del comentario vacio";
		}
		if(!isset($data['autor'])){
			$data['autor']=null;
		}
		$query = "INSERT INTO comentarios (anuncio,cuerpo,autor) VALUES(".
		"{$data['anuncio']},".
		"'{$data['cuerpo']}',".
		"'{$data['autor']}'".
		");";

		$insert = $db->query($query);
		$result = array(
			'status' => 'error',
			'code' => 404,
			'sql' => $query,
			'message' => 'comentario NO se ha creado'
		);
		if($insert){
			$result = array(
				'status' => 'success',
				'sql' => $query,
				'code' => 200,
				'message' => 'comentario creado correctamente'
			);
		}
		echo json_encode($result);
	});


//Metodo para devolver el listado de comentarios guardados

	$app->get('/comentarios', function() use($db, $app){
		$sql = 'SELECT * FROM comentarios ORDER BY id DESC;';
		$query = $db->query($sql);
		$comentarios = array();
		while ($comentario = $query->fetch_assoc()) {
			$comentarios[] = $comentario;
		}
		$result = array(
			'status' => 'success',
			'code' => 200,
			'data' => $comentarios
		);
		echo json_encode($result);
	});

//Metodo para buscar un comentario

	$app->get('/comentario/:id', function($id) use($db, $app){
		$sql = 'SELECT * FROM comentarios WHERE id = '.$id;
		$query = $db->query($sql);
		$result = array(
			'status' => 'error',
			'code' => 404,
			'message' => 'comentario no disponible'
		);
		if($query->num_rows == 1){
			$comentario = $query->fetch_assoc();
			$result = array(
				'status' => 'success',
				'code' => 200,
				'data' => $comentario
			);
		}
		echo json_encode($result);
	});

// Metodo para buscar los comentarios de un anuncio
	$app->get('/comentariosde/:id', function($id) use($db, $app){
		$sql = 'SELECT * FROM comentarios WHERE anuncio = '.$id;
		$query = $db->query($sql);
		$comentarios = array();
		while ($comentario = $query->fetch_assoc()) {
			$comentarios[] = $comentario;
		}
		$result = array(
			'status' => 'success',
			'code' => 200,
			'data' => $comentarios
		);
		echo json_encode($result);
	});
//Metodo para borrar comentario

	$app->get('/deleteComentario/:id', function($id) use($db, $app){
		$sql = 'DELETE FROM comentarios WHERE id = '.$id;
		$query = $db->query($sql);
		if($query){
			$result = array(
				'status' => 'success',
				'code' => 200,
				'message' => 'El comentario se ha eliminado correctamente!!'
			);
		}else{
			$result = array(
				'status' => 'error',
				'code' => 404,
				'message' => 'El comentario no se ha eliminado!!'
			);
		}
		echo json_encode($result);
	});
	
	//Metodo para actualizar el comentario
	
	$app->post('/updateComentario/:id', function($id) use($db, $app){
		$json = $app->request->post('json');
		$data = json_decode($json, true);
		$sql = "UPDATE comentarios SET ".
		"cuerpo = '{$data["cuerpo"]}' ";
		$sql .= "WHERE id = {$id}";
		$query = $db->query($sql);
		if($query){
			$result = array(
				'status' => 'success',
				'code' => 200,
				'message' => 'El comentario se ha actualizado correctamente!!'
			);
		}else{
			$result = array(
				'status' => 'error',
				'code' => 404,
				'message' => 'El comentario no se ha actualizado!!'
			);
		}
		echo json_encode($result);
	});


//Metodo para crear usuarios **************************************************************************************************
	$app->post('/usuarios', function() use($app, $db){
		$json = $app->request->post('json');
		$data = json_decode($json, true);
		$pass = hash('sha256', $data['pass']);
		echo "pasword: ".$pass." ";

		$data['pass']= hash('sha256',$data['pass']);
		if(!isset($data['nombre'])){
			$data['nombre']='Anonimo';
		}
		if(!isset($data['apellido'])){
			$data['apellido']='AnonimoSurname';
		}
		$data['rol']='user';
		if(!isset($data['imagen'])){
			$data['imagen']=null;
		}
		$query = "INSERT INTO usuarios (mail,pass,nombre,apellido,rol,imagen) VALUES(".
		"'{$data['mail']}',".
		"'{$data['pass']}',".
		"'{$data['nombre']}',".
		"'{$data['apellido']}',".
		"'{$data['rol']}',".
		"'{$data['imagen']}'".
		");";
		$insert = $db->query($query);
		$result = array(
			'status' => 'error',
			'code' => 404,
			'sql' => $query,
			'message' => 'usuario NO se ha creado'
		);
		if($insert){
			$result = array(
				'status' => 'success',
				'code' => 200,
				'sql' => $query,
				'message' => 'usuario creado correctamente'
			);
		}
		echo json_encode($result);
	});
	
	//Metodo para devolver el listado de usuarios guardados  
	
	$app->get('/usuarios', function() use($db, $app){
		$sql = 'SELECT * FROM usuarios;';
		$query = $db->query($sql);
		$usuarios = array();
		while ($usuario = $query->fetch_assoc()) {
			$usuarios[] = $usuario;
		}
		$result = array(
			'status' => 'success',
			'code' => 200,
			'data' => $usuarios
		);
		echo json_encode($result);
	});
	
	//Metodo para buscar un usuario
	
	$app->get('/usuario/:id', function($id) use($db, $app){
		$sql = 'SELECT * FROM usuarios WHERE mail = "'.$id.'"';
		$query = $db->query($sql);
		$result = array(
			'status' => 'error',
			'code' => 404,
			'message' => 'usuario no disponible'
		);
		if($query->num_rows == 1){
			$usuario = $query->fetch_assoc();
			$result = array(
				'status' => 'success',
				'code' => 200,
				'data' => $usuario
			);
		}
		echo json_encode($result);
	});
	//Metodo para borrar usuario
	
	$app->get('/deleteUser/:id', function($id) use($db, $app){
		$sql = 'DELETE FROM usuarios WHERE mail = "'.$id.'";';
		$query = $db->query($sql);
		if($query){
			$result = array(
				'status' => 'success',
				'code' => 200,
				'message' => 'El usuario se ha eliminado correctamente!!'
			);
		}else{
			$result = array(
				'status' => 'error',
				'code' => 404,
				'message' => 'El usuario no se ha eliminado!!'
			);
		}
		echo json_encode($result);
	});

		//Metodo para actualizar el usuario //necesario nombre y apellido

	$app->post('/updateUser/:id', function($id) use($db, $app){
		$json = $app->request->post('json');
		$data = json_decode($json, true);
		$sql = "UPDATE usuarios SET ".
		"nombre = '{$data["nombre"]}', ".
		"apellido = '{$data["apellido"]}', ".
		"pass = '{$data["pass"]}' ";
		if(isset($data['imagen']) && $data['imagen']!=null){
			$sql .= ", imagen = '{$data["imagen"]}' ";
		}
		$sql .= "WHERE mail = '".$id."'";
		$query = $db->query($sql);

		if($query){
			$result = array(
				'status' => 'success',
				'consulta' => $sql,
				'code' => 200,
				'message' => 'El usuario se ha actualizado correctamente!!'
			);
		}else{
			$result = array(
				'consulta' => $sql,
				'status' => 'error',
				'code' => 404,
				'message' => 'El usuario no se ha actualizado!!'
			);
		}
		echo json_encode($result);
	});

		//Metodo para subir photo de un usuario

		/*$app->post('/upload-photo', function() use($db, $app){
			$result = array(
				'status' 	=> 'error',
				'code'		=> 404,
				'message' 	=> 'El archivo no ha podido subirse'
			);
			if(isset($_FILES['uploads'])){
				$piramideUploader = new PiramideUploader();
				$upload = $piramideUploader->upload('image', "uploads", "uploads", array('image/jpeg', 'image/png', 'image/gif'));
				$file = $piramideUploader->getInfoFile();
				$file_name = $file['complete_name'];
		
				if(isset($upload) && $upload["uploaded"] == false){
					$result = array(
						'status' 	=> 'error',
						'code'		=> 404,
						'message' 	=> 'El archivo no ha podido subirse'
					);
				}else{
					$result = array(
						'status' 	=> 'success',
						'code'		=> 200,
						'message' 	=> 'El archivo se ha subido',
						'filename'  => $file_name
					);
				}
			}
			echo json_encode($result);
		});*/

		$app->run();