-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08/04/2026 às 01:18
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `dados_paroquia`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `eventos`
--

CREATE TABLE `eventos` (
  `id_Eventos` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `data_evento` varchar(100) NOT NULL,
  `descricao` varchar(300) DEFAULT NULL,
  `id_igreja` int(11) DEFAULT NULL,
  `igreja_id_igreja` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `eventos`
--

INSERT INTO `eventos` (`id_Eventos`, `nome`, `data_evento`, `descricao`, `id_igreja`, `igreja_id_igreja`) VALUES
(1, 'Missa de Domingo', '2026-04-05', 'Culto semanal da igreja', NULL, 1),
(2, 'Encontro de Jovens', '2026-04-10', 'Reunião especial para jovens', NULL, 2),
(3, 'Estudo Bíblico', '2026-04-12', 'Estudo em grupo sobre o evangelho', NULL, 3),
(4, 'Louvor', '2026-04-15', 'Culto com músicas e adoração', NULL, 1),
(5, 'Retiro Espiritual', '2026-04-20', 'Fim de semana de retiro', NULL, 2),
(6, 'Campanha de Oração', '2026-04-25', 'Semana dedicada à oração', NULL, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `igreja`
--

CREATE TABLE `igreja` (
  `id_igreja` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `endereco` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `igreja`
--

INSERT INTO `igreja` (`id_igreja`, `nome`, `endereco`) VALUES
(1, 'Igreja Central', 'Rua das Flores, 123'),
(2, 'Igreja Esperança', 'Av. Brasil, 456'),
(3, 'Igreja da Fé', 'Praça da Paz, 789');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `primeiro_nome` varchar(45) NOT NULL,
  `sobrenome` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `senha` varchar(100) NOT NULL,
  `id_igreja` int(11) DEFAULT NULL,
  `igreja_id_igreja` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `primeiro_nome`, `sobrenome`, `email`, `celular`, `senha`, `id_igreja`, `igreja_id_igreja`) VALUES
(1, 'João', 'Silva', 'joao.silva@email.com', '11999990001', 'senha123', NULL, 1),
(2, 'Maria', 'Oliveira', 'maria.oliveira@email.com', '11999990002', 'senha123', NULL, 1),
(3, 'Carlos', 'Souza', 'carlos.souza@email.com', '11999990003', 'senha123', NULL, 2),
(4, 'Ana', 'Costa', 'ana.costa@email.com', '11999990004', 'senha123', NULL, 2),
(5, 'Pedro', 'Santos', 'pedro.santos@email.com', '11999990005', 'senha123', NULL, 3),
(6, 'Julia', 'Ferreira', 'julia.ferreira@email.com', '11999990006', 'senha123', NULL, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_has_eventos`
--

CREATE TABLE `usuario_has_eventos` (
  `usuario_id_usuario` int(11) NOT NULL,
  `Eventos_id_Eventos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario_has_eventos`
--

INSERT INTO `usuario_has_eventos` (`usuario_id_usuario`, `Eventos_id_Eventos`) VALUES
(1, 1),
(1, 4),
(2, 1),
(2, 5),
(3, 2),
(3, 6),
(4, 2),
(4, 6),
(5, 3),
(6, 3);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id_Eventos`),
  ADD KEY `fk_eventos_igreja` (`igreja_id_igreja`);

--
-- Índices de tabela `igreja`
--
ALTER TABLE `igreja`
  ADD PRIMARY KEY (`id_igreja`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuario_igreja` (`igreja_id_igreja`);

--
-- Índices de tabela `usuario_has_eventos`
--
ALTER TABLE `usuario_has_eventos`
  ADD PRIMARY KEY (`usuario_id_usuario`,`Eventos_id_Eventos`),
  ADD KEY `fk_evento_usuario` (`Eventos_id_Eventos`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id_Eventos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `igreja`
--
ALTER TABLE `igreja`
  MODIFY `id_igreja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `fk_eventos_igreja` FOREIGN KEY (`igreja_id_igreja`) REFERENCES `igreja` (`id_igreja`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_igreja` FOREIGN KEY (`igreja_id_igreja`) REFERENCES `igreja` (`id_igreja`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `usuario_has_eventos`
--
ALTER TABLE `usuario_has_eventos`
  ADD CONSTRAINT `fk_evento_usuario` FOREIGN KEY (`Eventos_id_Eventos`) REFERENCES `eventos` (`id_Eventos`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_evento` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
