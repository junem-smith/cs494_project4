
export type Profile = {
    id: string,
    username: string | null,
    full_name: string | null,
    image_urls: string[] | null,
    website: string | null
}

export const profileSelectorString = "id, username, full_name, image_urls, website"