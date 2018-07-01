DROP DATABASE IF EXISTS todoanunciosdb;
CREATE DATABASE IF NOT EXISTS todoanunciosdb;
USE todoanunciosdb;
CREATE TABLE usuarios(
    mail varchar (50),
    pass varchar (80),
    nombre varchar(50),
    apellido varchar(60),
    rol varchar (5),
    imagen varchar (255),
    PRIMARY KEY (mail)
)ENGINE=InnoDb;

INSERT INTO usuarios (mail, pass, nombre, apellido, rol, imagen) VALUES ('user@user.com', '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', 'userName', 'userApellido','user','user.jpg' );
INSERT INTO usuarios (mail, pass, nombre, apellido, rol, imagen) VALUES ('admin@admin.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'adminName', 'adminApellido', 'admin','user3.jpg' );

CREATE TABLE anuncios(
    id int(255) auto_increment not null,
    titulo varchar(255),
    cuerpo varchar(255),
    precio float (6,2),
    categoria varchar (80),
    autor varchar (255),
    imagen varchar (255),
    constraint pk_anuncios PRIMARY KEY(id),
    constraint fk_anuncios  FOREIGN KEY (autor) REFERENCES usuarios (mail) ON DELETE CASCADE
)ENGINE=InnoDb;


INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Se vende Coche', 'Seat Ibiza Promocion 25 aniversario con 110CV de motor.', 6500, "Equipamiento y Maquinaria", 'user@user.com', 'coche.jpg');
INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Vendo bicicleta "vintash"', 'Vendo la bicicleta vieja de mi padre por falta de uso', 80, "Deportes", 'admin@admin.com', 'bici.jpg');
INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Vendo pc Acer', '500gb de HDD y 8gb de ram',400, "Consolas y Videojuegos", 'admin@admin.com', 'pc.jpg');
INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Se vende Ford', 'Ford Corrida 1. 8 TD, con 90 caballos. El coche es familia de 1998. Perfecto de mecanica. ITV, correas de distribucion, ruedas, pastillas de freno, filtros y aceite recien cambiados, todo demostrable.', 9696, "Equipamiento y Maquinaria", 'user@user.com', 'ford.jpeg');
INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Vendo pistola de Rick y Morty', 'Autentica pistola de coleccionista de la serie Rick y Morty', 120, "Coleccionismo", 'admin@admin.com', 'pistola.jpeg');
INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Se vende la comoda de mi abuela', 'La vendo porque mi abuela decia que no le gustaba una comoda tan actual',200, "Casa, Jardin y Bricolaje", 'user@user.com', 'comoda.jpeg');
INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Regalo Vans nuevas', 'Es broma, no las regalo, las vendo porque no me gustan. Nunca me las he puesto asi que estan nuevas. Son se la edicion de los vengadores. Talla 43',19.50, "Ropa, Zapatos y Complementos", 'admin@admin.com', 'vans.jpeg');
INSERT INTO anuncios ( titulo, cuerpo, precio, categoria, autor, imagen) VALUES ( 'Nintendo 64 Mini', 'Vendo la nintendo 64 mini, con el super mario 64 resmasterizado y dos mandos',119.50, "Consolas y Videojuegos", 'user@user.com', 'nintendo.jpeg');


CREATE TABLE comentarios(
    id int(255) auto_increment not null,
    anuncio INT,
    cuerpo varchar(254),
    autor varchar (50),
    PRIMARY KEY (id),
    FOREIGN KEY (anuncio) REFERENCES anuncios (id) ON DELETE CASCADE,
    FOREIGN KEY (autor) REFERENCES usuarios (mail) ON DELETE CASCADE
)ENGINE=InnoDb;

INSERT INTO comentarios ( anuncio, cuerpo, autor) VALUES ( 1, 'Hola, me gustaria saber cuantos kilometros tiene el coche', 'admin@admin.com');
INSERT INTO comentarios ( anuncio, cuerpo, autor) VALUES ( 2, 'Me interesa tu bicicleta pero no puedo gastarme mas de 60 euros', 'user@user.com');
