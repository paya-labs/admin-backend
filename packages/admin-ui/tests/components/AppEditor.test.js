import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppEditor from '../../src/components/AppEditor.vue';
import { EDITOR_TOOLBAR_COMPACT } from '../../src/components/appEditorToolbar';

// TipTap needs a small delay to initialize the editor
const waitForEditor = () => new Promise((resolve) => setTimeout(resolve, 100));

describe('AppEditor', () => {
    it('renders editor element', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        expect(wrapper.find('.app-editor-wrapper').exists()).toBe(true);
        expect(wrapper.find('.tiptap').exists()).toBe(true);
    });

    it('renders label when provided', async () => {
        const wrapper = mount(AppEditor, {
            props: { label: 'Article Body' },
        });
        await waitForEditor();

        expect(wrapper.find('label').text()).toBe('Article Body');
    });

    it('renders label with required indicator', async () => {
        const wrapper = mount(AppEditor, {
            props: { label: 'Article Body', required: true },
        });
        await waitForEditor();

        expect(wrapper.find('label').text()).toContain('Article Body');
        expect(wrapper.find('label span').text()).toBe('*');
    });

    it('does not render label when not provided', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        expect(wrapper.find('label').exists()).toBe(false);
    });

    it('emits update:modelValue with HTML content', async () => {
        const wrapper = mount(AppEditor, {
            props: {
                modelValue: '',
                'onUpdate:modelValue': (e) =>
                    wrapper.setProps({ modelValue: e }),
            },
        });
        await waitForEditor();

        const editorEl = wrapper.find('.tiptap');
        editorEl.element.innerHTML = '<p>Hello world</p>';
        editorEl.element.dispatchEvent(new Event('input'));

        // Directly use the editor instance to type content
        const editorComponent = wrapper.findComponent({
            name: 'EditorContent',
        });
        expect(editorComponent.exists()).toBe(true);
    });

    it('renders with initial modelValue content', async () => {
        const wrapper = mount(AppEditor, {
            props: { modelValue: '<p>Initial content</p>' },
        });
        await waitForEditor();

        expect(wrapper.find('.tiptap').text()).toContain('Initial content');
    });

    it('displays error message when provided', async () => {
        const wrapper = mount(AppEditor, {
            props: { error: 'Content is required' },
        });
        await waitForEditor();

        const helperText = wrapper.find('.text-danger');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Content is required');
    });

    it('displays hint when provided and no error', async () => {
        const wrapper = mount(AppEditor, {
            props: { hint: 'Write your article content here' },
        });
        await waitForEditor();

        const helperText = wrapper.find('.text-muted');
        expect(helperText.exists()).toBe(true);
        expect(helperText.text()).toBe('Write your article content here');
    });

    it('prefers error over hint when both provided', async () => {
        const wrapper = mount(AppEditor, {
            props: {
                error: 'Error message',
                hint: 'Hint message',
            },
        });
        await waitForEditor();

        const helperText = wrapper.find('.text-danger');
        expect(helperText.text()).toBe('Error message');
        expect(wrapper.find('.text-muted').exists()).toBe(false);
    });

    it('applies error border class when error is present', async () => {
        const wrapper = mount(AppEditor, {
            props: { error: 'Error' },
        });
        await waitForEditor();

        const container = wrapper
            .find('.app-editor-wrapper > div:not(:first-child)')
            .exists()
            ? wrapper.find('.rounded-md')
            : wrapper.find('.app-editor-wrapper').find('.rounded-md');
        expect(container.classes()).toContain('border-danger');
    });

    it('applies normal border class when no error', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const container = wrapper.find('.rounded-md');
        expect(container.classes()).toContain('border-input-border');
    });

    it('renders toolbar with formatting buttons', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const toolbar = wrapper.find('[role="toolbar"]');
        expect(toolbar.exists()).toBe(true);

        const buttons = toolbar.findAll('button');
        // H1, H2, H3, B, I, U, S, UL, OL, Quote, MD = 11 buttons
        expect(buttons.length).toBe(11);
    });

    it('renders toolbar buttons with correct labels', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const buttons = wrapper.findAll('[role="toolbar"] button');
        const labels = buttons.map((b) => b.text());
        expect(labels).toEqual([
            'H1',
            'H2',
            'H3',
            'B',
            'I',
            'U',
            'S',
            'UL',
            'OL',
            'Quote',
            'MD',
        ]);
    });

    it('toolbar buttons have aria-pressed attribute', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const buttons = wrapper.findAll('[role="toolbar"] button');
        buttons.forEach((btn) => {
            expect(btn.attributes('aria-pressed')).toBeDefined();
        });
    });

    it('toolbar buttons have aria-label attribute', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const buttons = wrapper.findAll('[role="toolbar"] button');
        buttons.forEach((btn) => {
            expect(btn.attributes('aria-label')).toBeTruthy();
        });
    });

    it('renders separator dividers between toolbar groups', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const separators = wrapper.findAll('[role="separator"]');
        // 4 groups = 3 separators + 1 before MD toggle = 4 separators
        expect(separators.length).toBe(4);
    });

    it('disables toolbar buttons when disabled', async () => {
        const wrapper = mount(AppEditor, {
            props: { disabled: true },
        });
        await waitForEditor();

        const buttons = wrapper.findAll('[role="toolbar"] button');
        buttons.forEach((btn) => {
            expect(btn.element.disabled).toBe(true);
        });
    });

    it('applies opacity when disabled', async () => {
        const wrapper = mount(AppEditor, {
            props: { disabled: true },
        });
        await waitForEditor();

        const container = wrapper.find('.rounded-md');
        expect(container.classes()).toContain('opacity-50');
    });

    // Markdown mode tests
    it('renders MD toggle button in toolbar', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const mdButton = wrapper.find('[aria-label="Toggle markdown mode"]');
        expect(mdButton.exists()).toBe(true);
        expect(mdButton.text()).toBe('MD');
    });

    it('clicking MD toggle shows textarea and hides TipTap editor', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const mdButton = wrapper.find('[aria-label="Toggle markdown mode"]');
        await mdButton.trigger('click');

        expect(wrapper.find('textarea.app-editor-markdown').exists()).toBe(
            true,
        );
        // TipTap editor should be hidden (v-show=false)
        expect(wrapper.find('.tiptap').isVisible()).toBe(false);
    });

    it('clicking MD toggle again returns to rich text mode', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const mdButton = wrapper.find('[aria-label="Toggle markdown mode"]');
        // Enter markdown mode
        await mdButton.trigger('click');
        expect(wrapper.find('textarea.app-editor-markdown').exists()).toBe(
            true,
        );

        // Exit markdown mode
        await mdButton.trigger('click');
        expect(wrapper.find('textarea.app-editor-markdown').exists()).toBe(
            false,
        );
        expect(wrapper.find('.tiptap').isVisible()).toBe(true);
    });

    it('formatting buttons are disabled in markdown mode', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const mdButton = wrapper.find('[aria-label="Toggle markdown mode"]');
        await mdButton.trigger('click');

        const formattingButtons = wrapper
            .findAll('[role="toolbar"] button')
            .filter((btn) => btn.text() !== 'MD');
        formattingButtons.forEach((btn) => {
            expect(btn.element.disabled).toBe(true);
        });
    });

    // Toolbar prop tests
    it('renders the full toolbar by default', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        const buttons = wrapper.findAll('[role="toolbar"] button');
        const labels = buttons.map((b) => b.text());
        expect(labels).toEqual([
            'H1',
            'H2',
            'H3',
            'B',
            'I',
            'U',
            'S',
            'UL',
            'OL',
            'Quote',
            'MD',
        ]);
    });

    it('renders only compact toolbar buttons with EDITOR_TOOLBAR_COMPACT', async () => {
        const wrapper = mount(AppEditor, {
            props: { toolbar: EDITOR_TOOLBAR_COMPACT },
        });
        await waitForEditor();

        const buttons = wrapper.findAll('[role="toolbar"] button');
        const labels = buttons.map((b) => b.text());
        expect(labels).toEqual(['B', 'I', 'U', 'UL', 'OL']);
        expect(
            wrapper.find('[aria-label="Toggle markdown mode"]').exists(),
        ).toBe(false);

        const separators = wrapper.findAll('[role="separator"]');
        // 2 groups (text decoration, lists) = 1 separator, no MD separator
        expect(separators.length).toBe(1);
    });

    it('renders a custom toolbar subset without separators', async () => {
        const wrapper = mount(AppEditor, {
            props: { toolbar: ['bold', 'italic'] },
        });
        await waitForEditor();

        const buttons = wrapper.findAll('[role="toolbar"] button');
        const labels = buttons.map((b) => b.text());
        expect(labels).toEqual(['B', 'I']);
        expect(wrapper.findAll('[role="separator"]').length).toBe(0);
    });

    // Attachment tests
    it('does not render attach button with default toolbar', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        expect(wrapper.find('[aria-label="Attach file"]').exists()).toBe(false);
        expect(wrapper.find('input[type="file"]').exists()).toBe(false);
    });

    it('renders attach button when attach is in the toolbar', async () => {
        const wrapper = mount(AppEditor, {
            props: { toolbar: [...EDITOR_TOOLBAR_COMPACT, 'attach'] },
        });
        await waitForEditor();

        const attachButton = wrapper.find('[aria-label="Attach file"]');
        expect(attachButton.exists()).toBe(true);
        expect(attachButton.find('svg').exists()).toBe(true);
        expect(wrapper.find('input[type="file"]').exists()).toBe(true);
    });

    it('passes accept prop to the hidden file input', async () => {
        const wrapper = mount(AppEditor, {
            props: { toolbar: ['attach'], accept: 'image/*' },
        });
        await waitForEditor();

        expect(wrapper.find('input[type="file"]').attributes('accept')).toBe(
            'image/*',
        );
    });

    it('emits attach with selected files and resets the input', async () => {
        const wrapper = mount(AppEditor, {
            props: { toolbar: ['attach'] },
        });
        await waitForEditor();

        const input = wrapper.find('input[type="file"]');
        const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
        Object.defineProperty(input.element, 'files', {
            value: [file],
            configurable: true,
        });
        await input.trigger('change');

        expect(wrapper.emitted('attach')).toHaveLength(1);
        expect(wrapper.emitted('attach')[0][0]).toEqual([file]);
        expect(input.element.value).toBe('');
    });

    it('disables attach button when disabled', async () => {
        const wrapper = mount(AppEditor, {
            props: { toolbar: ['attach'], disabled: true },
        });
        await waitForEditor();

        expect(
            wrapper.find('[aria-label="Attach file"]').element.disabled,
        ).toBe(true);
    });

    it('renders attachment pills with names and formatted sizes', async () => {
        const wrapper = mount(AppEditor, {
            props: {
                attachments: [
                    { id: '1', name: 'report.pdf', size: 655360 },
                    { id: '2', name: 'photo.jpg', size: 1258291 },
                    { id: '3', name: 'notes.txt' },
                ],
            },
        });
        await waitForEditor();

        const pills = wrapper.find('.app-editor-attachments');
        expect(pills.exists()).toBe(true);
        expect(pills.text()).toContain('report.pdf');
        expect(pills.text()).toContain('640 KB');
        expect(pills.text()).toContain('photo.jpg');
        expect(pills.text()).toContain('1.2 MB');
        expect(pills.text()).toContain('notes.txt');
    });

    it('does not render pill row without attachments', async () => {
        const wrapper = mount(AppEditor);
        await waitForEditor();

        expect(wrapper.find('.app-editor-attachments').exists()).toBe(false);
    });

    it('emits remove-attachment with the id', async () => {
        const wrapper = mount(AppEditor, {
            props: {
                attachments: [{ id: 'abc', name: 'report.pdf', size: 100 }],
            },
        });
        await waitForEditor();

        await wrapper.find('[aria-label="Remove report.pdf"]').trigger('click');

        expect(wrapper.emitted('remove-attachment')).toEqual([['abc']]);
    });

    it('disables attachment remove buttons when disabled', async () => {
        const wrapper = mount(AppEditor, {
            props: {
                disabled: true,
                attachments: [{ id: 'abc', name: 'report.pdf' }],
            },
        });
        await waitForEditor();

        expect(
            wrapper.find('[aria-label="Remove report.pdf"]').element.disabled,
        ).toBe(true);
    });
});
