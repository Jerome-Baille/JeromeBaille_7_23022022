-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 11 mai 2022 à 13:57
-- Version du serveur :  5.7.24
-- Version de PHP : 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `database_development`
--

-- --------------------------------------------------------

--
-- Structure de la table `comlikes`
--

CREATE TABLE `comlikes` (
  `id` int(11) NOT NULL,
  `commentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `isLiked` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `comlikes`
--

INSERT INTO `comlikes` (`id`, `commentId`, `userId`, `isLiked`, `createdAt`, `updatedAt`) VALUES
(12, 16, 10, 0, '2022-04-04 21:14:41', '2022-04-04 21:14:41'),
(57, 15, 1, 1, '2022-04-19 14:59:33', '2022-04-19 14:59:34'),
(72, 51, 1, 0, '2022-04-22 15:50:08', '2022-04-22 15:50:08');

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `isSignaled` tinyint(4) NOT NULL DEFAULT '0',
  `points` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `userId`, `postId`, `content`, `attachment`, `isSignaled`, `points`, `createdAt`, `updatedAt`) VALUES
(1, 1, 12, 'Un commentaire ayant été modifié', NULL, 1, 0, '2022-03-14 13:13:33', '2022-04-01 20:06:31'),
(2, 1, 12, 'Ceci est autre un commentaire pour le post 12', NULL, 1, 0, '2022-03-14 13:28:01', '2022-03-27 14:15:33'),
(7, 10, 4, 'Modification commentaire post 4', NULL, 1, 0, '2022-03-19 12:07:10', '2022-05-03 11:49:51'),
(8, 1, 12, 'Un nouveau com', NULL, 0, 0, '2022-04-01 17:13:37', '2022-04-01 17:13:37'),
(13, 10, 12, 'This is a comment', NULL, 0, 0, '2022-04-03 21:19:48', '2022-04-25 02:48:48'),
(15, 10, 37, 'un nouveau commentaire', NULL, 0, 1, '2022-04-04 12:56:57', '2022-05-10 15:17:56'),
(16, 10, 37, 'Un autre commentaire', NULL, 0, -1, '2022-04-04 13:02:37', '2022-05-08 04:15:45'),
(20, 1, 43, 'This is a comment up-to-date with a picture included', 'http://localhost:3000/images/favicon-eggplant.png1651962738743.png', 0, 0, '2022-04-20 09:01:02', '2022-05-11 13:22:36'),
(51, 1, 44, 'El comentario', NULL, 0, -1, '2022-04-20 12:23:23', '2022-04-25 04:40:24'),
(100, 1, 44, 'Random comment', NULL, 0, 0, '2022-04-22 22:42:22', '2022-04-23 04:21:49'),
(112, 1, 44, 'Another comment', NULL, 0, 0, '2022-04-23 03:33:49', '2022-05-01 13:10:31'),
(113, 1, 44, '4', NULL, 0, 0, '2022-05-07 03:55:45', '2022-05-07 03:55:45'),
(165, 1, 44, 'Commentaire 1', NULL, 0, 0, '2022-05-08 16:55:10', '2022-05-08 16:55:10'),
(285, 1, 48, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pulvinar justo nec est faucibus consequat. Aenean maximus est felis, ac accumsan nisi aliquam non. Donec ac laoreet est.', NULL, 0, 0, '2022-05-09 20:24:49', '2022-05-10 15:11:31'),
(286, 1, 48, 'Curabitur gravida vestibulum enim, at elementum ante varius non. Aliquam hendrerit neque quis blandit varius. Aliquam sem velit, luctus sit amet lectus at, tempor sollicitudin nulla', NULL, 0, 0, '2022-05-09 20:25:01', '2022-05-09 20:25:01'),
(287, 1, 48, 'Phasellus vel placerat velit', NULL, 0, 0, '2022-05-09 20:25:09', '2022-05-09 20:25:09'),
(288, 1, 48, 'Etiam ut eros ante.', NULL, 0, 0, '2022-05-09 20:25:16', '2022-05-09 20:25:16'),
(289, 1, 48, 'Duis interdum porta lacinia.', NULL, 0, 0, '2022-05-09 20:25:23', '2022-05-09 20:25:23'),
(290, 1, 48, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', NULL, 0, 0, '2022-05-09 20:25:30', '2022-05-09 20:25:30'),
(291, 1, 48, 'Sed lacinia turpis at interdum tempor.', NULL, 0, 0, '2022-05-09 20:25:40', '2022-05-09 20:25:40'),
(292, 1, 48, NULL, 'http://localhost:3000/images/ohmyfood.png1652127998186.png', 0, 0, '2022-05-09 20:26:38', '2022-05-09 20:26:38');

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `isLiked` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `userId`, `postId`, `isLiked`, `createdAt`, `updatedAt`) VALUES
(5, 10, 1, 1, '2022-03-27 11:42:07', '2022-03-27 11:42:07'),
(14, 10, 12, 1, '2022-04-01 14:41:06', '2022-04-01 14:41:06'),
(18, 10, 36, 1, '2022-04-03 21:21:36', '2022-04-04 21:22:11'),
(20, 10, 4, 0, '2022-04-04 21:20:10', '2022-04-04 21:20:58'),
(30, 10, 37, 0, '2022-04-05 15:03:09', '2022-04-05 15:03:09'),
(67, 1, 36, 1, '2022-04-19 01:46:35', '2022-04-19 01:46:35'),
(249, 1, 12, 1, '2022-04-19 14:40:14', '2022-04-19 14:41:29'),
(261, 1, 43, 1, '2022-04-19 15:17:44', '2022-04-19 15:17:44'),
(265, 1, 44, 0, '2022-04-23 01:46:12', '2022-04-23 01:46:17'),
(266, 10, 44, 0, '2022-05-01 01:02:24', '2022-05-01 01:02:24');

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(5000) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isSignaled` tinyint(4) NOT NULL DEFAULT '0',
  `points` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `userId`, `title`, `content`, `attachment`, `thumbnail`, `isActive`, `isSignaled`, `points`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae ipsum pulvinar, fringilla arcu sit amet, consectetur est. Sed placerat pellentesque risus, in tincidunt felis feugiat accumsan.', 'http://localhost:3000/images/lodge.jpg1652065076744.jpg', 'http://localhost:3000/images/thumbnails-lodge.jpg1652065076744.jpg', 1, 0, 1, '2022-02-27 20:29:24', '2022-05-09 02:57:56'),
(2, 1, NULL, 'Maecenas accumsan laoreet eros, eget ultrices eros scelerisque commodo. Ut malesuada, dui quis lobortis sollicitudin, purus ante aliquet sapien, ut volutpat turpis massa vulputate enim. Vivamus hendrerit dapibus lacus quis mattis.', NULL, NULL, 1, 1, 0, '2022-02-27 20:29:34', '2022-05-08 02:09:14'),
(4, 1, NULL, 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin volutpat neque a ex suscipit rhoncus.', NULL, NULL, 1, 0, -1, '2022-02-27 20:29:52', '2022-04-11 17:33:20'),
(6, 4, NULL, 'lorem ipsum', NULL, NULL, 1, 1, 0, '2022-03-02 18:52:52', '2022-03-02 18:52:52'),
(12, 4, NULL, 'In pellentesque bibendum nisi id feugiat. Cras hendrerit orci a lobortis tincidunt. Mauris imperdiet viverra tristique. Donec consequat aliquet tempor. ', NULL, NULL, 1, 1, 3, '2022-03-14 13:04:26', '2022-04-19 14:41:29'),
(35, 10, NULL, 'Proin egestas massa ut urna tristique, a dignissim dolor facilisis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum condimentum vulputate turpis, at elementum diam dapibus sit amet. Sed quis ex metus. Duis scelerisque magna risus, nec facilisis tellus gravida sit amet. Ut ultrices tellus eget ex semper blandit. Praesent sed enim porttitor, mattis elit quis, finibus metus.', NULL, NULL, 1, 1, 0, '2022-04-03 19:32:22', '2022-05-03 10:56:19'),
(36, 10, NULL, 'Un renard blanc', 'http://localhost:3000/images/arctic-fox.jpg1652065032068.jpg', 'http://localhost:3000/images/thumbnails-arctic-fox.jpg1652065032068.jpg', 1, 0, 2, '2022-04-03 20:41:21', '2022-05-09 16:53:35'),
(37, 10, NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac varius lacus. Nunc at facilisis justo, a scelerisque quam. Morbi eget euismod augue, vel elementum mi. Nam nec cursus velit. Aliquam cursus purus eu metus consequat sagittis. Aenean porta leo at neque feugiat, id malesuada diam ultrices. Nunc ultrices vitae quam in tincidunt. Curabitur sagittis molestie lectus vitae tempus. Ut finibus dui lectus, non congue risus euismod eu. Nam eget ante scelerisque, volutpat felis eget, viverra lectus. Donec tincidunt sapien et ultricies bibendum. Integer interdum ultrices turpis, non dictum nibh tempor ac. Aliquam erat volutpat. Proin volutpat quam sed magna ullamcorper sagittis consequat at justo. Etiam consequat ut purus id iaculis.\r\n\r\nSed eleifend nulla in justo iaculis dictum id in ligula. Donec laoreet urna ut lobortis vestibulum. Etiam congue ante elementum mi dignissim bibendum. Suspendisse ac ultricies massa. Donec sed arcu sollicitudin, posuere leo eget, placerat sem. Proin viverra id felis sit amet feugiat. Duis sed posuere urna. Mauris eleifend tellus vel sapien blandit sodales. Nam semper tempor urna, vitae ultrices nibh varius vel. Cras facilisis magna ac dolor viverra, eget tempor turpis luctus. Fusce et sem eget lorem volutpat accumsan. Nam hendrerit, eros ut tempor efficitur, lorem lorem tristique magna, vitae blandit ex lorem vel massa.\r\n\r\nDuis faucibus ultricies consequat. Aliquam sed odio non felis scelerisque sodales ac id odio. Cras elementum massa at lacus euismod, eget tincidunt elit rhoncus. Mauris ac velit sed justo iaculis commodo sed vel mauris. Suspendisse euismod convallis nibh, quis tempus purus porta sed. Nullam vel nunc felis. Donec sollicitudin justo ac odio hendrerit, id hendrerit diam egestas. Ut ultricies nibh ac mattis ultrices. Pellentesque porta, leo eget auctor dictum, turpis nibh efficitur libero, ac aliquet orci felis at metus. Fusce iaculis non neque fringilla aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\n\r\nCurabitur arcu orci, varius eget dictum a, accumsan eu leo. Nulla sit amet lorem erat. Phasellus pharetra tincidunt justo, mattis dictum lorem luctus vitae. Nulla quis neque id quam hendrerit scelerisque quis at tortor. Donec ac nunc neque. Nullam hendrerit orci sed ligula pretium, nec sagittis massa dapibus. Maecenas suscipit tincidunt neque, ut tincidunt nulla tempor sit amet. Vivamus hendrerit purus at interdum scelerisque. Donec tincidunt hendrerit fringilla. Suspendisse nec posuere ante. Aenean at erat gravida, vestibulum lorem ut, porta diam. Nulla semper convallis semper. Aenean vulputate, ligula vitae pulvinar posuere, eros ante venenatis sem, ac aliquet enim velit at sapien. Curabitur at pretium libero. Ut sit amet nunc ut lacus mollis ullamcorper eget lobortis neque. Aenean quis placerat mauris, id tempus lectus.\r\n\r\nMorbi maximus varius purus nec iaculis. Suspendisse dapibus vitae dui ut consequat. Maecenas mollis lectus non ligula dictum pulvinar. Nam molestie metus eros, quis vulputate dolor dapibus vel. Morbi facilisis id velit non congue. Nulla non ultricies augue, ac mattis leo. Curabitur in tellus lobortis, sollicitudin lectus in, viverra lectus. Integer sit amet interdum orci, eu finibus nibh.', NULL, NULL, 1, 1, -1, '2022-04-04 11:25:10', '2022-05-08 04:14:07'),
(38, 1, NULL, 'Nunc accumsan lobortis est, eget ullamcorper elit vulputate ac. Praesent quis cursus diam, non mollis purus. Quisque blandit ante risus, sed dignissim nibh dignissim quis. Donec ac odio in nisi gravida iaculis. Integer justo libero, semper at mi id, ultricies imperdiet justo. Sed id malesuada ex. Quisque tempor ullamcorper turpis ac venenatis.', NULL, NULL, 1, 0, 0, '2022-04-17 21:59:35', '2022-04-17 21:59:35'),
(39, 1, NULL, ' Duis ex lacus, feugiat ac convallis a, pulvinar id turpis. Etiam congue, tellus quis tempor laoreet, urna lorem dapibus lorem, ac fringilla elit erat eu purus.', NULL, NULL, 1, 0, 0, '2022-04-17 21:59:44', '2022-04-17 21:59:44'),
(40, 1, NULL, 'Praesent finibus diam risus, quis semper est ultricies non. Sed et condimentum felis. Vivamus tempor metus vel pellentesque lacinia.', NULL, NULL, 1, 0, 0, '2022-04-17 21:59:49', '2022-04-17 21:59:49'),
(41, 1, NULL, 'Nulla in congue mauris. Phasellus et enim orci. Etiam at tempor neque, id bibendum nulla. Mauris molestie lorem ipsum, nec malesuada turpis viverra vitae.', NULL, NULL, 1, 1, 0, '2022-04-17 21:59:55', '2022-05-03 10:56:14'),
(42, 1, NULL, 'Nunc accumsan lobortis est, eget ullamcorper elit vulputate ac. Praesent quis cursus diam, non mollis purus. Quisque blandit ante risus, sed dignissim nibh dignissim quis. Donec ac odio in nisi gravida iaculis. Integer justo libero, semper at mi id, ultricies imperdiet justo. Sed id malesuada ex. Quisque tempor ullamcorper turpis ac venenatis.', NULL, NULL, 1, 0, 0, '2022-04-17 22:00:06', '2022-05-11 13:22:01'),
(43, 1, NULL, 'Donec volutpat pellentesque ante eu ultrices. Pellentesque turpis ligula, rutrum sit amet sodales at, tempus ut eros. Cras magna mi, sod', NULL, NULL, 1, 0, 1, '2022-04-17 22:00:20', '2022-05-08 03:15:25'),
(44, 1, NULL, 'Aenean id tempus felis, at semper est. Nam sed nibh aliquam, lacinia dui nec, ultrices nulla. Ut eget dui sed libero rhoncus vestibulum scelerisque vel nunc.', NULL, NULL, 1, 0, -2, '2022-04-17 22:00:31', '2022-05-10 15:17:32'),
(48, 1, NULL, NULL, 'http://localhost:3000/images/bye_guys.gif1652066838711.gif', 'http://localhost:3000/images/thumbnails-bye_guys.gif1652066838711.gif', 1, 1, 0, '2022-05-03 12:48:51', '2022-05-11 13:14:59'),
(58, 1, NULL, 'Hello, quel beau soleil aujourd\'hui ! Vous ne trouvez pas ?', 'http://localhost:3000/images/kevin-hikari-rV_Qd1l-VXg-unsplash.jpg1652066697711.jpg', 'http://localhost:3000/images/thumbnails-kevin-hikari-rV_Qd1l-VXg-unsplash.jpg1652066697711.jpg', 1, 0, 0, '2022-05-09 02:54:29', '2022-05-09 22:43:43');

-- --------------------------------------------------------

--
-- Structure de la table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20220225153245-create-user.js'),
('20220225153425-create-message.js'),
('20220225153425-create-post.js'),
('20220226210052-create-like.js'),
('20220303215026-create-like.js'),
('20220306153738-create-like.js'),
('20220306180943-create-comment.js'),
('20220404131939-create-com-like.js');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `bio`, `avatar`, `isAdmin`, `createdAt`, `updatedAt`) VALUES
(1, 'test@test.com', 'Test', '$2b$05$tnIER94GUlRgUe8HIQzmHORMpUkeWih68LNzdSmydyg6p7/oofybS', 'This is my bio', NULL, 1, '2022-02-27 18:16:40', '2022-04-26 14:13:15'),
(2, 'different@test.com', 'Different', '$2b$05$Gq1CdVj9lLcBng/A.PMtYeUj8OsdIUSjqj65rI.ckceWwjNDp0qO6', 'une bio différente', NULL, 0, '2022-02-27 21:38:10', '2022-05-11 13:21:25'),
(4, 'Random@test.com', 'Random', '$2b$05$lRyvvV.D8CzyVJ2j/Nvjueu57ipmAgZLSHDRmEeRq4tnZwD28kgt.', NULL, NULL, 0, '2022-02-27 23:02:44', '2022-05-09 21:08:15'),
(10, 'Username2022@test.com', 'Username2022', '$2b$05$NUPufoZOMS/FPil3HptTeO5xifSi8QT/2xw.nfUdzhIQUurO3EdHu', NULL, NULL, 0, '2022-03-07 00:06:20', '2022-04-01 14:54:35'),
(41, 'LastUser@test.com', 'LastUser', '$2b$05$iojYZFTdXVQI9o/BxDH.JeAdMT8i.v8aCdc3LQtS8Ite6h8DS8ee2', NULL, NULL, 0, '2022-04-29 00:54:48', '2022-04-29 00:54:48'),
(45, 'Monday@test.com', 'Monday', '$2b$05$/1Eb85qBOHTUI/Qy2hfGwu0uEKqEwv7MCtEZuS2dpMskMhq4ILcsi', NULL, NULL, 0, '2022-05-09 17:03:10', '2022-05-09 17:03:10'),
(47, 'Lundi@test.com', 'Lundi', '$2b$05$fernjSPUBHvXdGwIyXPRfekKYbRqfZ5GgyqAN5yxtShu9BZ2Njzwi', NULL, NULL, 0, '2022-05-09 21:29:47', '2022-05-09 21:29:47');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comlikes`
--
ALTER TABLE `comlikes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commentId` (`commentId`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `postId` (`postId`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `postId` (`postId`);

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_ibfk_1` (`userId`);

--
-- Index pour la table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comlikes`
--
ALTER TABLE `comlikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=296;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=279;

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comlikes`
--
ALTER TABLE `comlikes`
  ADD CONSTRAINT `comlikes_ibfk_1` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comlikes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
