-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Ven 14 Juillet 2017 à 15:27
-- Version du serveur :  10.1.23-MariaDB-9+deb9u1
-- Version de PHP :  7.0.19-1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `etna-rest`
--

-- --------------------------------------------------------

--
-- Structure de la table `recipes__category`
--

CREATE TABLE `recipes__category` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Contenu de la table `recipes__category`
--

INSERT INTO `recipes__category` (`id`, `slug`, `name`) VALUES
(1, 'fruit', 'fruit'),
(2, 'vegetalien', 'vegetalien'),
(3, 'vegetarien', 'vegetarien'),
(4, 'viande', 'viande'),
(5, 'normaly', 'homnivore');

-- --------------------------------------------------------

--
-- Structure de la table `recipes__recipe`
--

CREATE TABLE `recipes__recipe` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `step` longtext COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:array)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Contenu de la table `recipes__recipe`
--

INSERT INTO `recipes__recipe` (`id`, `user_id`, `name`, `slug`, `step`) VALUES
(7, 1, 'clafoutie au pomme de terre', 'apple-pie', 'a:3:{i:1;s:16:\"Couper les pomme\";i:2;s:13:\"Melanger tout\";i:3;s:22:\"Magique ca deviens bon\";}'),
(8, 1, 'frite au chedar', 'american-fries', 'a:4:{i:1;s:18:\"Couper les patates\";i:2;s:18:\"Chauffer le chedar\";i:3;s:16:\"Beaucoup d\'huile\";i:4;s:9:\"Bonne app\";}'),
(9, 2, 'vegan chocolat', 'vegeta-rien', 'a:2:{i:1;s:17:\"manger des fruits\";i:2;s:18:\"manger des legumes\";}'),
(10, 2, 'coca cola', 'cola', 'a:1:{i:0;s:21:\"aller au supermarché\";}');

-- --------------------------------------------------------

CREATE TABLE `recipes__recipe_category` (
  `category_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `recipes__recipe_category` (`recipe_id`, `category_id`) VALUES
(7, 5),
(8, 5),
(9, 2),
(9, 3),
(10, 1)
;

--
-- Structure de la table `users__user`
--

CREATE TABLE `users__user` (
  `id` int(11) NOT NULL,
  `username` varchar(180) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `last_login` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Contenu de la table `users__user`
--

INSERT INTO `users__user` (`id`, `username`, `email`, `password`) VALUES
(1, 'lilelulo', 'lilelulo@etna.com', 'passworddelilelulo'),
(2, 'etna', 'etna@etna.com', 'passworddeetna');


--
-- Index pour la table `recipes__recipe`
--
ALTER TABLE `recipes__recipe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_45A663E0989D9B62` (`slug`),
  ADD KEY `IDX_45A663E0A76ED395` (`user_id`);

--
-- Index pour la table `users__user`
--
ALTER TABLE `users__user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_37C1021B92FC23A8` (`password`);

ALTER TABLE `recipes__category`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `recipes__recipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `recipes__recipe_category`
  ADD PRIMARY KEY (`recipe_id`, `category_id`);

ALTER TABLE `recipes__recipe_category`
  ADD CONSTRAINT `FK_45A663E0A76ED576` FOREIGN KEY (`recipe_id`) REFERENCES `recipes__recipe` (`id`);

ALTER TABLE `recipes__recipe_category`
  ADD CONSTRAINT `FK_45A663E0A76ED568` FOREIGN KEY (`category_id`) REFERENCES `recipes__category` (`id`);


ALTER TABLE `users__user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `recipes__recipe`
  ADD CONSTRAINT `FK_45A663E0A76ED395` FOREIGN KEY (`user_id`) REFERENCES `users__user` (`id`);

