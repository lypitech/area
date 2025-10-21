import github from '../assets/logos/github_240.png';
import discord from '../assets/logos/discord.png';
import logo from '../assets/logo.png';

const getLogo = (name: string) => {
    switch (name) {
        case 'discord':
            return discord;
        case 'github':
            return github;
        case 'area':
            return logo;
        default:
            return '';
    }
}

export { getLogo }