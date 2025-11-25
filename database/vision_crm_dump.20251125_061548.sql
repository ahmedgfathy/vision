/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for osx10.20 (arm64)
--
-- Host: localhost    Database: vision_crm
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `agents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `agents` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `table_name` varchar(100) NOT NULL,
  `record_id` int(11) NOT NULL,
  `action` enum('CREATE','UPDATE','DELETE') NOT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `audit_logs` VALUES
(1,1,'properties',1,'CREATE',NULL,'{\"title\":\"test\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"price\":1000000,\"area\":100,\"property_owner_phone\":\"01002778090\",\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":false,\"has_pool\":false,\"has_gym\":false,\"has_security\":false,\"has_parking\":false,\"has_garden\":false,\"has_balcony\":false,\"has_elevator\":false,\"has_ac\":false,\"has_heating\":false,\"has_internet\":false,\"pets_allowed\":false,\"address\":\"\",\"city\":\"\",\"notes\":\"\"}','2025-11-25 01:56:13'),
(2,1,'properties',1,'UPDATE','{\"id\":1,\"title\":\"test\",\"address\":\"\",\"price\":\"1000000.00\",\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"assigned_to_user_id\":null,\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"city\":\"\",\"notes\":\"\",\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":1,\"property_id\":1,\"file_path\":\"/Users/ahmedgomaa/Downloads/vision/backend/uploads/properties/media-1764036149295-370124835.png\",\"file_type\":\"image\",\"file_size\":1915965,\"uploaded_at\":\"2025-11-25T02:02:29.000Z\"}]}','{\"title\":\"test\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"price\":\"1000000.00\",\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"address\":\"\",\"city\":\"\",\"notes\":\"\",\"id\":1,\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"assigned_to_user_id\":null,\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":1,\"property_id\":1,\"file_path\":\"/Users/ahmedgomaa/Downloads/vision/backend/uploads/properties/media-1764036149295-370124835.png\",\"file_type\":\"image\",\"file_size\":1915965,\"uploaded_at\":\"2025-11-25T02:02:29.000Z\"}]}','2025-11-25 02:05:48'),
(3,1,'properties',1,'UPDATE','{\"id\":1,\"title\":\"test\",\"address\":\"\",\"price\":\"1000000.00\",\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"assigned_to_user_id\":null,\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"city\":\"\",\"notes\":\"\",\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"/Users/ahmedgomaa/Downloads/vision/backend/uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"}]}','{\"title\":\"test\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"price\":\"1000000.00\",\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"address\":\"\",\"city\":\"\",\"notes\":\"\",\"id\":1,\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"assigned_to_user_id\":null,\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"/Users/ahmedgomaa/Downloads/vision/backend/uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"}]}','2025-11-25 02:06:05'),
(4,1,'properties',1,'UPDATE','{\"id\":1,\"title\":\"test\",\"address\":\"\",\"price\":\"1000000.00\",\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"assigned_to_user_id\":null,\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"city\":\"\",\"notes\":\"\",\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"}]}','{\"title\":\"test\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"price\":\"1000000.00\",\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"address\":\"\",\"city\":\"\",\"notes\":\"\",\"id\":1,\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"assigned_to_user_id\":null,\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"}]}','2025-11-25 02:09:06'),
(5,1,'properties',1,'UPDATE','{\"id\":1,\"title\":\"test\",\"address\":\"\",\"price\":\"1000000.00\",\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"assigned_to_user_id\":null,\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"city\":\"\",\"notes\":\"\",\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"},{\"id\":3,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036688039-965438590.png\",\"file_type\":\"image\",\"file_size\":972068,\"uploaded_at\":\"2025-11-25T02:11:28.000Z\"}]}','{\"title\":\"test\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"price\":\"1000000.00\",\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"address\":\"\",\"city\":\"\",\"notes\":\"\",\"id\":1,\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"assigned_to_user_id\":null,\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"},{\"id\":3,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036688039-965438590.png\",\"file_type\":\"image\",\"file_size\":972068,\"uploaded_at\":\"2025-11-25T02:11:28.000Z\"}]}','2025-11-25 02:11:30'),
(6,1,'properties',1,'UPDATE','{\"id\":1,\"title\":\"test\",\"address\":\"\",\"price\":\"1000000.00\",\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"assigned_to_user_id\":null,\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":0,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":0,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"city\":\"\",\"notes\":\"\",\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"},{\"id\":3,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036688039-965438590.png\",\"file_type\":\"image\",\"file_size\":972068,\"uploaded_at\":\"2025-11-25T02:11:28.000Z\"}]}','{\"title\":\"test\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"price\":\"1000000.00\",\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":true,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":true,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"address\":\"\",\"city\":\"\",\"notes\":\"\",\"id\":1,\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"assigned_to_user_id\":null,\"updated_at\":\"2025-11-25T01:56:13.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"},{\"id\":3,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036688039-965438590.png\",\"file_type\":\"image\",\"file_size\":972068,\"uploaded_at\":\"2025-11-25T02:11:28.000Z\"}]}','2025-11-25 02:12:04'),
(7,1,'properties',1,'UPDATE','{\"id\":1,\"title\":\"test\",\"address\":\"\",\"price\":\"1000000.00\",\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"assigned_to_user_id\":null,\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":1,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":1,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"city\":\"\",\"notes\":\"\",\"updated_at\":\"2025-11-25T02:12:04.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"},{\"id\":3,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036688039-965438590.png\",\"file_type\":\"image\",\"file_size\":972068,\"uploaded_at\":\"2025-11-25T02:11:28.000Z\"}]}','{\"title\":\"test\",\"reference_number\":\"1\",\"description\":\"test\",\"type_id\":1,\"status_id\":1,\"listing_type_id\":1,\"price\":\"1000000.00\",\"area\":\"100.00\",\"property_owner_phone\":\"01002778090\",\"bedrooms\":2,\"bathrooms\":1,\"parking_spaces\":20,\"year_built\":2020,\"floor_number\":1,\"total_floors\":1,\"furnished\":1,\"has_pool\":0,\"has_gym\":0,\"has_security\":0,\"has_parking\":1,\"has_garden\":0,\"has_balcony\":0,\"has_elevator\":0,\"has_ac\":0,\"has_heating\":0,\"has_internet\":0,\"pets_allowed\":0,\"address\":\"villa 13 sector 7\",\"city\":\"10th of Ramadan\",\"notes\":\"okay\",\"id\":1,\"type\":null,\"status\":\"available\",\"created_at\":\"2025-11-25T01:56:13.000Z\",\"assigned_to_user_id\":null,\"updated_at\":\"2025-11-25T02:12:04.000Z\",\"created_by_user_id\":1,\"updated_by_user_id\":1,\"type_name\":\"Apartment\",\"status_name\":\"Available\",\"listing_type_name\":\"Sale\",\"assigned_to_name\":null,\"assigned_to_email\":null,\"created_by_name\":\"admin\",\"updated_by_name\":\"admin\",\"media\":[{\"id\":2,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036363641-748629370.png\",\"file_type\":\"image\",\"file_size\":1869696,\"uploaded_at\":\"2025-11-25T02:06:03.000Z\"},{\"id\":3,\"property_id\":1,\"file_path\":\"uploads/properties/media-1764036688039-965438590.png\",\"file_type\":\"image\",\"file_size\":972068,\"uploaded_at\":\"2025-11-25T02:11:28.000Z\"}]}','2025-11-25 02:12:21');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `dynamic_lists`
--

DROP TABLE IF EXISTS `dynamic_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dynamic_lists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dynamic_lists`
--

LOCK TABLES `dynamic_lists` WRITE;
/*!40000 ALTER TABLE `dynamic_lists` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `dynamic_lists` VALUES
(1,'area','New Cairo',1,1,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(2,'area','6th October',1,2,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(3,'area','Zamalek',1,3,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(4,'area','Maadi',1,4,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(5,'area','Nasr City',1,5,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(6,'mall','Cairo Festival City',1,1,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(7,'mall','City Stars',1,2,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(8,'mall','Mall of Arabia',1,3,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(9,'mall','City Centre Almaza',1,4,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(10,'community','Rehab City',1,1,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(11,'community','Madinaty',1,2,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(12,'community','Palm Hills',1,3,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(13,'community','New Giza',1,4,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(14,'type','Apartment',1,1,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(15,'type','Villa',1,2,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(16,'type','Office',1,3,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(17,'type','Shop',1,4,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(18,'type','Warehouse',1,5,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(19,'phase','Phase 1',1,1,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(20,'phase','Phase 2',1,2,'2025-11-25 02:30:33','2025-11-25 02:30:33'),
(21,'phase','Phase 3',1,3,'2025-11-25 02:30:33','2025-11-25 02:30:33');
/*!40000 ALTER TABLE `dynamic_lists` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'new',
  `source` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `more_info`
--

DROP TABLE IF EXISTS `more_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `more_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `property_name` varchar(255) NOT NULL,
  `handler_id` int(11) DEFAULT NULL,
  `phase_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `phase_id` (`phase_id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_handler` (`handler_id`),
  CONSTRAINT `more_info_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `more_info_ibfk_2` FOREIGN KEY (`handler_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `more_info_ibfk_3` FOREIGN KEY (`phase_id`) REFERENCES `dynamic_lists` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `more_info`
--

LOCK TABLES `more_info` WRITE;
/*!40000 ALTER TABLE `more_info` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `more_info` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `owner_info`
--

DROP TABLE IF EXISTS `owner_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `offered_by` enum('Owner','Owner Representative','Broker','Guard') NOT NULL,
  `update_state` enum('Want Update','Is Updated','Hidden') DEFAULT 'Want Update',
  `owner_name` varchar(255) NOT NULL,
  `update_by` int(11) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `last_follow_in` date DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `call_update` enum('Answered','No Answer','Not Available') DEFAULT NULL,
  `call_note` text DEFAULT NULL,
  `new_feedback` enum('Done','Under Follow Up','Unknown','Need Follow') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `update_by` (`update_by`),
  KEY `idx_property` (`property_id`),
  KEY `idx_feedback` (`new_feedback`),
  CONSTRAINT `owner_info_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `owner_info_ibfk_2` FOREIGN KEY (`update_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner_info`
--

LOCK TABLES `owner_info` WRITE;
/*!40000 ALTER TABLE `owner_info` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `owner_info` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `resource` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `permissions` VALUES
(1,'properties.view','properties','view','View properties'),
(2,'properties.create','properties','create','Create properties'),
(3,'properties.update','properties','update','Update properties'),
(4,'properties.delete','properties','delete','Delete properties'),
(5,'admin.dropdown.view','admin.dropdown','view','View dropdown settings'),
(6,'admin.dropdown.create','admin.dropdown','create','Create dropdown items'),
(7,'admin.dropdown.update','admin.dropdown','update','Update dropdown items'),
(8,'admin.dropdown.delete','admin.dropdown','delete','Delete dropdown items');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit_for` enum('For Rent','For Sale','Sold Out','Recycle') NOT NULL,
  `area_id` int(11) DEFAULT NULL,
  `unit_license` enum('Administrative','Commercial','Medical','Factory') DEFAULT NULL,
  `mall_id` int(11) DEFAULT NULL,
  `community_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `finished` enum('Semi Finished','Fully Finished','Furnished','Concrete') DEFAULT NULL,
  `building` varchar(255) DEFAULT NULL,
  `total_price` decimal(15,2) DEFAULT NULL,
  `more_units` tinyint(1) DEFAULT 0,
  `unit_no` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_by_user_id` int(11) DEFAULT NULL,
  `updated_by_user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `parking_spaces` int(11) DEFAULT NULL,
  `furnished` tinyint(1) DEFAULT 0,
  `has_pool` tinyint(1) DEFAULT 0,
  `has_gym` tinyint(1) DEFAULT 0,
  `has_security` tinyint(1) DEFAULT 0,
  `has_garden` tinyint(1) DEFAULT 0,
  `has_balcony` tinyint(1) DEFAULT 0,
  `has_elevator` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `mall_id` (`mall_id`),
  KEY `community_id` (`community_id`),
  KEY `created_by_user_id` (`created_by_user_id`),
  KEY `updated_by_user_id` (`updated_by_user_id`),
  KEY `idx_unit_for` (`unit_for`),
  KEY `idx_area` (`area_id`),
  KEY `idx_type` (`type_id`),
  CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `dynamic_lists` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_ibfk_2` FOREIGN KEY (`mall_id`) REFERENCES `dynamic_lists` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_ibfk_3` FOREIGN KEY (`community_id`) REFERENCES `dynamic_lists` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_ibfk_4` FOREIGN KEY (`type_id`) REFERENCES `dynamic_lists` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_ibfk_5` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_ibfk_6` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `property_gallery`
--

DROP TABLE IF EXISTS `property_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` enum('image','document') DEFAULT 'image',
  `is_primary` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_primary` (`is_primary`),
  CONSTRAINT `property_gallery_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_gallery`
--

LOCK TABLES `property_gallery` WRITE;
/*!40000 ALTER TABLE `property_gallery` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `property_gallery` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `role_permissions` VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `roles` VALUES
(1,'admin','Administrator with full access'),
(2,'manager','Manager with access to most resources'),
(3,'agent','Agent with limited access');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `due_date` date DEFAULT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `update_info`
--

DROP TABLE IF EXISTS `update_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `update_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `reminder_time` time DEFAULT NULL,
  `rent_to` date DEFAULT NULL,
  `reminder_date` date DEFAULT NULL,
  `repeated_statement` enum('Repeated','Not Repeated','Unknown') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_reminder_date` (`reminder_date`),
  CONSTRAINT `update_info_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `update_info`
--

LOCK TABLES `update_info` WRITE;
/*!40000 ALTER TABLE `update_info` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `update_info` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
(1,'admin','admin@vision.com','$2b$10$Rm6NXp0ynsX7wi2eZFbcUOYGNks7QFtTeNicYxpXG8vLIJsl.FcPO',1,'2025-11-25 00:09:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-11-25  6:13:00
