// Утилита для перевода контента
export const translateContent = (t, key, fallback = '') => {
    return t(`content.${key}`, { defaultValue: fallback });
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
