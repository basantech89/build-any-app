import { UIStructure } from '../index'

import path from 'path'
import { copyToRoot, writeToRoot } from 'utils/fs'

function assets(this: UIStructure, uiLib?: string) {
	if (uiLib === 'react-bootstrap') {
		writeToRoot(
			'src/assets/styles/themes/dark.lazy.scss',
			`
				@import '~bootstrap/scss/functions';
				@import '~bootstrap/scss/variables';

				$colors: (
					'primary': #ff0844,
					'secondary': #112d4e
				);

				$enable-gradients: true;
				$theme-colors: map-merge($theme-colors, $colors);

				@import '~bootstrap/scss/maps';
				@import '~bootstrap/scss/mixins';
				@import '~bootstrap/scss/utilities';
				@import '~bootstrap/scss/root';
				@import '~bootstrap/scss/reboot';
				@import '~bootstrap/scss/grid';
				@import '~bootstrap/scss/tables';
				@import '~bootstrap/scss/forms';
				@import '~bootstrap/scss/buttons';
				@import '~bootstrap/scss/nav';
				@import '~bootstrap/scss/navbar';
				@import '~bootstrap/scss/spinners';
				@import '~bootstrap/scss/helpers';
				@import '~bootstrap/scss/utilities/api';
				// @import "~bootstrap/scss/bootstrap";

				body.dark-theme {
					$body-color: #112b3c;
					--#{$variable-prefix}body-bg: #{$body-color};
					--#{$variable-prefix}body-bg-rgb: #{to-rgb($body-color)};

					.navbar {
						background: linear-gradient(to right, #ec250d 0, #fd5d93);
					}

					.auth-layout {
						&-img {
							background: url(https://source.unsplash.com/random/?dark,black,night) no-repeat;
						}
					}

					.auth {
						.auth-form {
							&-group {
								label {
									color: #dbe2ef;
								}

								a {
									color: #dbe2ef;
								}
							}

							h6 {
								color: #dbe2ef;
							}
						}
					}

					.form-control {
						background-color: #dbe2ef;
					}
				}
			`
		)

		writeToRoot(
			'src/assets/styles/themes/light.lazy.scss',
			`
				@import '~bootstrap/scss/functions';
				@import '~bootstrap/scss/variables';

				$colors: (
					'primary': #112b3c,
					'light': #efefef,
					'secondary': #dbe2ef
				);

				$enable-gradients: true;
				$theme-colors: map-merge($theme-colors, $colors);

				@import '~bootstrap/scss/maps';
				@import '~bootstrap/scss/mixins';
				@import '~bootstrap/scss/utilities';
				@import '~bootstrap/scss/root';
				@import '~bootstrap/scss/reboot';
				@import '~bootstrap/scss/grid';
				@import '~bootstrap/scss/tables';
				@import '~bootstrap/scss/forms';
				@import '~bootstrap/scss/buttons';
				@import '~bootstrap/scss/nav';
				@import '~bootstrap/scss/navbar';
				@import '~bootstrap/scss/spinners';
				@import '~bootstrap/scss/helpers';
				@import '~bootstrap/scss/utilities/api';
				// @import "~bootstrap/scss/bootstrap";

				body.light-theme {
					$body-color: #dbe2ef;
					--#{$variable-prefix}body-bg: #{$body-color};
					--#{$variable-prefix}body-bg-rgb: #{to-rgb($body-color)};

					.navbar {
						background: linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114));
					}

					.auth-layout {
						&-img {
							background: url(https://source.unsplash.com/random/?people,beach,day) no-repeat;
						}
					}

					.auth {
						.auth-form {
							&-group {
								label {
									color: #9699a9;
								}

								a {
									color: #3c415e;
								}
							}

							h6 {
								color: #3c415e;
							}
						}
					}
				}
			`
		)

		writeToRoot(
			'src/assets/styles/common.scss',
			`
				.auth {
					width: 50%;
					display: grid;
					grid-template-rows: auto 40px;

					& > * {
						margin: auto;
					}

					h6 {
						padding-bottom: 20px;
					}

					.auth-form {
						width: 50%;

						.auth-form-group {
							padding-bottom: 10px;
							position: relative;
							min-height: 93px;

							input.form-control {
								height: 38px;
								font-weight: 500;
							}

							a {
								font-weight: 500;
								text-decoration: none;
							}

							.input-icon-btn {
								font-size: 1.3em;
								padding: 5px;
								position: absolute;
								top: 50%;
								left: calc(100% - 35px);
								transform: translateY(-50%);
								color: #9699a9;

								&:hover {
									color: #dbe2ef;
								}

								svg {
									width: 18px;
									height: 18px;
								}
							}
						}

						button[type='submit'] {
							width: 100%;
							margin-top: 10px;
						}
					}
				}

				button + button {
					margin-left: 20px;
				}

				.error {
					color: red;
					padding-top: 4px;
					font-size: 13px;
				}
			`
		)

		writeToRoot(
			'src/assets/styles/components.scss',
			`
				input.form-check-input:checked {
					background-color: var(--bs-primary);
					border-color: var(--bs-primary);
				}

				button {
					height: 38px;
				}
			`
		)
	}

	copyToRoot(path.join(__dirname, './icons'), 'src/assets/icons/')
	copyToRoot(path.join(__dirname, './logos/'), 'src/assets/logos/')

	return this
}

export default assets
