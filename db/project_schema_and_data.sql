-- Quy ước tên database [tên_dự_án hoặc thương hiệu]_[chức_năng hoặc môi_trường: dev,prod]
CREATE DATABASE hopestar_store_dev;
use hopestar_store_dev;
CREATE TABLE `product` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`description` TEXT(65535),
	`weight` INTEGER,
	`chip_id` INTEGER,
	`brand_id` INTEGER,
	`screen_id` INTEGER,
	`card_id` INTEGER,
	`os_id` INTEGER,
	`wifi_id` INTEGER,
	`bluetooth_id` INTEGER,
	`nfc` BOOLEAN,
	`battery_id` INTEGER,
	`charger_type` TINYINT,
	`status` TINYINT,
	`content` TEXT(65535),
	PRIMARY KEY(`id`)
);


CREATE TABLE `chip` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `brand` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`status` TINYINT,
	`image_url` VARCHAR(255),
	PRIMARY KEY(`id`)
);


CREATE TABLE `screen` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) NOT NULL UNIQUE,
	`type` VARCHAR(255),
	`display_size` DOUBLE,
	`resolution_id` INTEGER,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `resolution` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`width` INTEGER,
	`height` INTEGER,
	`resolution_type` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `card` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) UNIQUE,
	`type` VARCHAR(255),
	`capacity` INTEGER,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `product_sim` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`product_id` INTEGER,
	`sim_id` INTEGER,
	PRIMARY KEY(`id`)
);


CREATE TABLE `sim` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255),
	`type` VARCHAR(255),
	`sim_multiple` TINYINT,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `OS` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) UNIQUE,
	PRIMARY KEY(`id`)
);


CREATE TABLE `product_detail` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`price` DECIMAL(24,2),
	`price_sell` DECIMAL(24,2),
	`inventory_quantity` INTEGER,
	`status` TINYINT,
	`color_id` INTEGER,
	`ram_id` INTEGER,
	`rom_id` INTEGER,
	`imei_id` INTEGER,
	`product_id` INTEGER,
	`image_url` VARCHAR(255),
	PRIMARY KEY(`id`)
);


CREATE TABLE `sale_detail` (
	`sale_id` INTEGER NOT NULL,
	`product_detail_id` INTEGER NOT NULL,
	`effective_price` DECIMAL(24,2),
	PRIMARY KEY(`sale_id`, `product_detail_id`)
);


CREATE TABLE `sale` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) UNIQUE,
	`name` VARCHAR(255),
	`date_start` DATETIME,
	`date_end` DATETIME,
	`status` TINYINT,
	`description` VARCHAR(1000),
	`discount_value` INTEGER,
	`discount_type` BOOLEAN,
	PRIMARY KEY(`id`)
);


CREATE TABLE `color` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255),
	`description` VARCHAR(1000),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `ram` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`capacity` INTEGER NOT NULL UNIQUE,
	`description` VARCHAR(1000),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `rom` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`capacity` INTEGER NOT NULL UNIQUE,
	`description` VARCHAR(1000),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `imei` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`imei_code` VARCHAR(20) NOT NULL UNIQUE,
	`description` VARCHAR(1000),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `cart_detail` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`quantity` INTEGER,
	`id_product_detail` INTEGER,
	`id_shopping_cart` INTEGER,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `shopping_cart` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`id_account` INTEGER,
	`code` VARCHAR(255),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `bill` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`id_cart` INTEGER,
	`id_account` INTEGER,
	`id_voucher` INTEGER,
	`total_price` DECIMAL(24,2),
	`customer_payment` DECIMAL(24,2),
	`amount_change` DECIMAL(24,2),
	`delivery_fee` DECIMAL(24,2),
	`total_due` DECIMAL(24,2),
	`customer_refund` DECIMAL(24,2),
	`discounted_total` DECIMAL(24,2),
	`delivery_date` DATETIME,
	`customer_preferred_date` DATETIME,
	`customer_appointment_date` DATETIME,
	`receipt_date` DATETIME,
	`payment_date` DATETIME,
	`bill_type` TINYINT,
	`status` TINYINT,
	`address` VARCHAR(255),
	`email` VARCHAR(255),
	`note` VARCHAR(1000),
	`phone` VARCHAR(255),
	`name` VARCHAR(255),
	`created_by` VARCHAR(255),
	`updated_by` VARCHAR(255),
	`payment_id` INTEGER,
	`delivery_id` INTEGER,
	PRIMARY KEY(`id`)
);


CREATE TABLE `account` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`full_name` VARCHAR(255),
	`code` VARCHAR(255) UNIQUE,
	`email` VARCHAR(255) UNIQUE,
	`password` VARCHAR(256),
	`phone` VARCHAR(255) UNIQUE,
	`address` VARCHAR(255),
	`google_id` VARCHAR(1000),
	`image_avatar` VARCHAR(255),
	`id_role` INTEGER,
	`gender` BOOLEAN,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `post` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`title` VARCHAR(255),
	`sumary` TEXT(65535),
	`content` TEXT(65535),
	`image` VARCHAR(255),
	`views` INTEGER,
	`status` TINYINT,
	`id_account` INTEGER,
	`id_category` INTEGER,
	PRIMARY KEY(`id`)
);


CREATE TABLE `role` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) UNIQUE,
	`name` VARCHAR(255) UNIQUE,
	PRIMARY KEY(`id`)
);


CREATE TABLE `voucher` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) UNIQUE,
	`name` VARCHAR(255),
	`condition_price_min` DECIMAL(24,2),
	`condition_price_max` DECIMAL(24,2),
	`discount_value` INTEGER,
	`voucher_type` BOOLEAN,
	`quantity` INTEGER,
	`start_time` DATETIME,
	`end_time` DATETIME,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `article_category` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255),
	`description` VARCHAR(1000),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `voucher_account` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`id_account` INTEGER,
	`id_voucher` INTEGER,
	PRIMARY KEY(`id`)
);


CREATE TABLE `payment_method` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`method` TINYINT,
	`type` TINYINT,
	`payment_amount` DECIMAL(24,2),
	`description` VARCHAR(255),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `delivery_method` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`delivery_type` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `bill_detail` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`price` DECIMAL(24,2),
	`quantity` INTEGER,
	`total_price` DECIMAL(24,2),
	`id_product_detail` INTEGER,
	`id_bill` INTEGER,
	`created_by` VARCHAR(255),
	`updated_by` VARCHAR(255),
	PRIMARY KEY(`id`)
);


CREATE TABLE `product_category` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`product_id` INTEGER,
	`category_id` INTEGER,
	PRIMARY KEY(`id`)
);


CREATE TABLE `category` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) UNIQUE,
	`name` VARCHAR(255),
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `front_camera_product` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`front_camera_id` INTEGER,
	`product_id` INTEGER,
	`camera_main` BOOLEAN,
	PRIMARY KEY(`id`)
);


CREATE TABLE `front_camera` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255),
	`type` TINYINT,
	`resolution` INTEGER,
	PRIMARY KEY(`id`)
);


CREATE TABLE `rear_camera_product` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`rear_camera_id` INTEGER,
	`product_id` INTEGER,
	`camera_main` BOOLEAN,
	PRIMARY KEY(`id`)
);


CREATE TABLE `rear_camera` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255),
	`type` TINYINT,
	`resolution` INTEGER,
	PRIMARY KEY(`id`)
);


CREATE TABLE `battery` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) UNIQUE,
	`capacity` INTEGER,
	`type` TINYINT,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `wifi` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


CREATE TABLE `bluetooth` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`status` TINYINT,
	PRIMARY KEY(`id`)
);


ALTER TABLE `product`
ADD FOREIGN KEY(`chip_id`) REFERENCES `chip`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product`
ADD FOREIGN KEY(`brand_id`) REFERENCES `brand`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product`
ADD FOREIGN KEY(`screen_id`) REFERENCES `screen`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `screen`
ADD FOREIGN KEY(`resolution_id`) REFERENCES `resolution`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_sim`
ADD FOREIGN KEY(`product_id`) REFERENCES `product`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_sim`
ADD FOREIGN KEY(`sim_id`) REFERENCES `sim`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product`
ADD FOREIGN KEY(`card_id`) REFERENCES `card`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product`
ADD FOREIGN KEY(`os_id`) REFERENCES `OS`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_detail`
ADD FOREIGN KEY(`color_id`) REFERENCES `color`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_detail`
ADD FOREIGN KEY(`ram_id`) REFERENCES `ram`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_detail`
ADD FOREIGN KEY(`rom_id`) REFERENCES `rom`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_detail`
ADD FOREIGN KEY(`imei_id`) REFERENCES `imei`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_detail`
ADD FOREIGN KEY(`product_id`) REFERENCES `product`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `sale_detail`
ADD FOREIGN KEY(`sale_id`) REFERENCES `sale`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `sale_detail`
ADD FOREIGN KEY(`product_detail_id`) REFERENCES `product_detail`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `cart_detail`
ADD FOREIGN KEY(`id_product_detail`) REFERENCES `product_detail`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `cart_detail`
ADD FOREIGN KEY(`id_shopping_cart`) REFERENCES `shopping_cart`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `post`
ADD FOREIGN KEY(`id_account`) REFERENCES `account`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `voucher_account`
ADD FOREIGN KEY(`id_account`) REFERENCES `account`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `voucher_account`
ADD FOREIGN KEY(`id_voucher`) REFERENCES `voucher`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `bill`
ADD FOREIGN KEY(`id_account`) REFERENCES `account`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `bill`
ADD FOREIGN KEY(`id_voucher`) REFERENCES `voucher`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `bill`
ADD FOREIGN KEY(`delivery_id`) REFERENCES `delivery_method`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `bill`
ADD FOREIGN KEY(`payment_id`) REFERENCES `payment_method`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `bill_detail`
ADD FOREIGN KEY(`id_bill`) REFERENCES `bill`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `bill_detail`
ADD FOREIGN KEY(`id_product_detail`) REFERENCES `product_detail`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `account`
ADD FOREIGN KEY(`id_role`) REFERENCES `role`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `post`
ADD FOREIGN KEY(`id_category`) REFERENCES `article_category`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_category`
ADD FOREIGN KEY(`product_id`) REFERENCES `product`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product_category`
ADD FOREIGN KEY(`category_id`) REFERENCES `category`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `front_camera_product`
ADD FOREIGN KEY(`product_id`) REFERENCES `product`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `front_camera_product`
ADD FOREIGN KEY(`front_camera_id`) REFERENCES `front_camera`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `rear_camera_product`
ADD FOREIGN KEY(`rear_camera_id`) REFERENCES `rear_camera`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `rear_camera_product`
ADD FOREIGN KEY(`product_id`) REFERENCES `product`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product`
ADD FOREIGN KEY(`battery_id`) REFERENCES `battery`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product`
ADD FOREIGN KEY(`wifi_id`) REFERENCES `wifi`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `product`
ADD FOREIGN KEY(`bluetooth_id`) REFERENCES `bluetooth`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `shopping_cart`
ADD FOREIGN KEY(`id_account`) REFERENCES `account`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE screen
ADD COLUMN refresh_rate INT;
