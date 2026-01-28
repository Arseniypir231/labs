// Утилита для перевода контента
export const translateContent = (t, key, fallback = '') => {
    return t(`content.${key}`, { defaultValue: fallback });
};

// Перевод заголовка поста
export const translatePostTitle = (t, title) => {
    if (!title) return t('content.postTitle');
    // Если заголовок совпадает с известным, используем перевод
    const knownTitle = "One of Saturn's largest rings may be newer than anyone";
    if (title === knownTitle) {
        return t('content.postTitle');
    }
    return title;
};

// Перевод даты
export const translateDate = (t, date) => {
    if (!date) return t('content.date');
    // Если дата совпадает с известной, используем перевод
    const knownDate = "June 6, 2019";
    if (date === knownDate) {
        return t('content.date');
    }
    return date;
};

// Перевод автора
export const translateAuthor = (t, author) => {
    if (!author) return t('content.author');
    // Если автор совпадает с известным, используем перевод
    const knownAuthor = "Rickie Baroch";
    if (author === knownAuthor) {
        return t('content.author');
    }
    return author;
};

// Перевод описания
export const translateDescription = (t, description) => {
    if (!description) return t('content.postDescription');
    // Если описание совпадает с известным, используем перевод
    const knownDesc = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem";
    if (description === knownDesc) {
        return t('content.postDescription');
    }
    return description;
};

export const translateCategory = (t, category) => {
    if (!category) return '';
    return t(`categories.${category}`, { defaultValue: category });
};

export const translateTag = (t, tag) => {
    if (!tag) return '';
    return t(`tags.${tag}`, { defaultValue: tag });
};

export const translateSocialLabel = (t, label) => {
    if (!label) return '';
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('likes')) {
        return t('social.likes');
    } else if (lowerLabel.includes('followers')) {
        return t('social.followers');
    } else if (lowerLabel.includes('subscribers')) {
        return t('social.subscribers');
    }
    return label;
};
