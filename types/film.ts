export enum FilmStatus {
    COMPLETED = 'COMPLETED',
    NOT_COMPLETED = 'NOT_COMPLETED',
    DOWNLOADED = 'DOWNLOADED',
}

export interface Film {
    id: string;
    vietnameseName: string;
    englishName: string;
    episodeCount: number;
    imageUrl: string;
    filmUrl: string;
    status: FilmStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFilmInput {
    vietnameseName: string;
    englishName: string;
    episodeCount: number;
    imageUrl: string;
    filmUrl: string;
    status: FilmStatus;
}

export interface UpdateFilmInput {
    vietnameseName?: string;
    englishName?: string;
    episodeCount?: number;
    imageUrl?: string;
    filmUrl?: string;
    status?: FilmStatus;
}
