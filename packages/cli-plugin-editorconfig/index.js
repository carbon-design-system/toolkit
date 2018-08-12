'use strict';

const defaultConfig = {
  root: true,
  '*': {
    charset: 'utf-8',
    end_of_line: 'lf',
    indent_size: 2,
    indent_style: 'space',
    insert_final_newline: true,
    max_line_length: 80,
    trim_trailing_whitespace: true,
  },
  '*.md': {
    // Markdown override allow for spaces at end of line
    trim_trailing_whitespace: false,
  },
};

module.exports = ({ api, options }) => {
  api.add(async ({ write }) => {
    const file = print({
      ...defaultConfig,
      ...options,
    });

    await write('.editorconfig', file);
  });
};

function print(config) {
  const { root, ...sections } = config;

  const formatted = Object.keys(sections).map(key => {
    const section = sections[key];
    const sectionConfig = Object.keys(section).map(name => {
      return `${name} = ${section[name]}`;
    });

    return `[${key}]
${sectionConfig.join('\n')}
`;
  });

  return `# top-most EditorConfig file
root = ${root}

${formatted.join('\n').trim()}`;
}
