"use client";

import {
	YStack,
	XStack,
	Input,
	TextArea,
	Label,
	Button,
	Text,
	Switch,
	Separator,
	H1,
	ScrollView,
	Tabs,
	Image,
} from "tamagui";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import type { Article } from "@dont-verify-me/shared-logic";
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	List,
	ListOrdered,
	Link2,
	Heading1,
	Heading2,
	Quote,
	Eye,
	Edit3,
} from "@tamagui/lucide-icons";
import { ShareArticle } from "./ShareArticle";
import { PlatformIconUploader } from "./PlatformIconUploader";
import "./editor-styles.css";

interface ArticleEditorProps {
	initialData?: Partial<Article>;
	onSave: (article: Partial<Article>) => Promise<void>;
	onCancel: () => void;
	platformName: string;
	platformIconUrl?: string;
	platformSlug?: string;
	onIconUpdate?: (newIconUrl: string) => void;
	supabase?: any;
}

export function ArticleEditor({
	initialData,
	onSave,
	onCancel,
	platformName,
	platformIconUrl,
	platformSlug,
	onIconUpdate,
	supabase,
}: ArticleEditorProps) {
	const [title, setTitle] = useState(initialData?.title || "");
	const [summary, setSummary] = useState(initialData?.summary || "");
	const [isPublished, setIsPublished] = useState(
		initialData?.is_published ?? false
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("edit");

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Underline,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-blue-600 underline",
				},
			}),
			Placeholder.configure({
				placeholder: "Write your privacy guide here...",
			}),
		],
		content: initialData?.content || "",
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[300px] p-4",
			},
		},
	});

	const handleSave = async () => {
		const content = editor?.getHTML() || "";

		if (!title.trim() || !content.trim() || content === "<p></p>") {
			setError("Title and content are required");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await onSave({
				title: title.trim(),
				summary: summary.trim(),
				content: content,
				is_published: isPublished,
			});
		} catch (err) {
			setError("Failed to save article");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const setLink = () => {
		const previousUrl = editor?.getAttributes("link").href;
		const url = window.prompt("URL", previousUrl);

		if (url === null) {
			return;
		}

		if (url === "") {
			editor?.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor
			?.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	};

	if (!editor) {
		return null;
	}

	return (
		<YStack
			gap="$4"
			padding="$4"
			backgroundColor="$background"
			borderRadius="$4"
		>
			<XStack justifyContent="space-between" alignItems="center">
				<Text fontSize="$6" fontWeight="bold">
					{`${initialData?.id ? "Edit" : "Create"} Article for ${platformName || "Platform"}`}
				</Text>
			</XStack>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				orientation="horizontal"
				flexDirection="column"
				flex={1}
			>
				<Tabs.List>
					<Tabs.Tab value="edit" flex={1}>
						<XStack gap="$2" alignItems="center">
							<Edit3 size={16} />
							<Text>Edit</Text>
						</XStack>
					</Tabs.Tab>
					<Tabs.Tab value="preview" flex={1}>
						<XStack gap="$2" alignItems="center">
							<Eye size={16} />
							<Text>Preview</Text>
						</XStack>
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Content value="edit" flex={1}>
					<YStack gap="$4" marginTop="$4">
						<YStack gap="$2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								size="$4"
								value={title}
								onChangeText={setTitle}
								placeholder="e.g., How to bypass age verification on Reddit"
							/>
						</YStack>
						<YStack gap="$2">
							<Label htmlFor="summary">Summary (Optional)</Label>
							<TextArea
								id="summary"
								size="$4"
								value={summary}
								onChangeText={setSummary}
								placeholder="Brief description of the article"
								numberOfLines={2}
							/>
						</YStack>
						<XStack gap="$3" alignItems="center">
							<Label htmlFor="is-published">Published</Label>
							<Switch
								id="is-published"
								size="$3"
								checked={isPublished}
								onCheckedChange={setIsPublished}
							>
								<Switch.Thumb animation="quick" />
							</Switch>
							<Text fontSize="$3" color="$color10">
								{isPublished
									? "Article is visible to users"
									: "Article is hidden (draft)"}
							</Text>
						</XStack>
						{supabase && platformSlug && onIconUpdate && (
							<YStack>
								<Separator marginVertical="$4" />
								<PlatformIconUploader
									platformSlug={platformSlug}
									currentIconUrl={platformIconUrl || ""}
									onIconUpdate={onIconUpdate}
									supabase={supabase}
								/>
								<Text fontSize="$2" color="$color11" marginTop="$2">
									Update the platform icon for {platformName}
								</Text>
								<Separator marginVertical="$4" />
							</YStack>
						)}
						<YStack gap="$2">
							<Label>Content</Label>
							<XStack
								gap="$2"
								padding="$2"
								borderWidth={1}
								borderColor="$borderColor"
								borderTopLeftRadius="$4"
								borderTopRightRadius="$4"
								backgroundColor="$background"
								flexWrap="wrap"
							>
								<Button
									size="$2"
									onPress={() => editor.chain().focus().toggleBold().run()}
									theme={editor.isActive("bold") ? "blue" : "gray"}
									icon={<Bold size={16} />}
								/>
								<Button
									size="$2"
									onPress={() => editor.chain().focus().toggleItalic().run()}
									theme={editor.isActive("italic") ? "blue" : "gray"}
									icon={<Italic size={16} />}
								/>
								<Button
									size="$2"
									onPress={() => editor.chain().focus().toggleUnderline().run()}
									theme={editor.isActive("underline") ? "blue" : "gray"}
									icon={<UnderlineIcon size={16} />}
								/>
								<Button
									size="$2"
									onPress={() =>
										editor.chain().focus().toggleHeading({ level: 1 }).run()
									}
									theme={
										editor.isActive("heading", { level: 1 }) ? "blue" : "gray"
									}
									icon={<Heading1 size={16} />}
								/>
								<Button
									size="$2"
									onPress={() =>
										editor.chain().focus().toggleHeading({ level: 2 }).run()
									}
									theme={
										editor.isActive("heading", { level: 2 }) ? "blue" : "gray"
									}
									icon={<Heading2 size={16} />}
								/>
								<Button
									size="$2"
									onPress={() =>
										editor.chain().focus().toggleBulletList().run()
									}
									theme={editor.isActive("bulletList") ? "blue" : "gray"}
									icon={<List size={16} />}
								/>
								<Button
									size="$2"
									onPress={() =>
										editor.chain().focus().toggleOrderedList().run()
									}
									theme={editor.isActive("orderedList") ? "blue" : "gray"}
									icon={<ListOrdered size={16} />}
								/>
								<Button
									size="$2"
									onPress={() =>
										editor.chain().focus().toggleBlockquote().run()
									}
									theme={editor.isActive("blockquote") ? "blue" : "gray"}
									icon={<Quote size={16} />}
								/>
								<Button
									size="$2"
									onPress={setLink}
									theme={editor.isActive("link") ? "blue" : "gray"}
									icon={<Link2 size={16} />}
								/>
							</XStack>
							<YStack
								borderWidth={1}
								borderColor="$borderColor"
								borderBottomLeftRadius="$4"
								borderBottomRightRadius="$4"
								backgroundColor="$background"
								minHeight={300}
								className="tiptap-wrapper"
							>
								<EditorContent editor={editor} />
							</YStack>
						</YStack>
						{error.length > 0 && (
							<Text color="$red10" fontSize="$3">
								{error}
							</Text>
						)}
					</YStack>
				</Tabs.Content>

				<Tabs.Content value="preview" flex={1}>
					<ScrollView marginTop="$4">
						<YStack
							padding="$6"
							gap="$4"
							maxWidth={800}
							alignSelf="center"
							width="100%"
						>
							<YStack gap="$2">
								<XStack gap="$2" alignItems="center">
									{platformIconUrl && (
										<Image
											source={{ uri: platformIconUrl }}
											width={20}
											height={20}
											alt={`${platformName} icon`}
										/>
									)}
									<Text
										fontSize="$3"
										color="$color11"
										textTransform="uppercase"
									>
										{platformName}
									</Text>
								</XStack>
								<H1 fontSize="$10" fontWeight="bold">
									{title || "Untitled Article"}
								</H1>
								{summary && (
									<Text fontSize="$5" color="$color11" lineHeight="$5">
										{summary}
									</Text>
								)}
							</YStack>
							<ShareArticle
								title={title || "Untitled Article"}
								summary={summary || undefined}
								url={typeof window !== "undefined" ? window.location.href : ""}
							/>
							<Separator />
							<YStack gap="$4" className="tiptap-wrapper">
								{editor?.getHTML() && editor.getHTML() !== "<p></p>" ? (
									<div
										className="prose prose-lg max-w-none"
										dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
										style={{
											fontSize: "1rem",
											lineHeight: "1.6",
											color: "inherit",
										}}
									/>
								) : (
									<Text color="$color10" fontStyle="italic">
										No content yet. Switch to Edit tab to start writing.
									</Text>
								)}
							</YStack>
							<Separator marginTop="$6" />
							<Text fontSize="$2" color="$color10" textAlign="center">
								Preview - Last updated: {new Date().toLocaleDateString()}
							</Text>
						</YStack>
					</ScrollView>
				</Tabs.Content>
			</Tabs>

			<XStack gap="$3" justifyContent="flex-end" marginTop="$4">
				<Button onPress={onCancel} theme="gray" disabled={loading}>
					Cancel
				</Button>
				<Button onPress={handleSave} theme="blue" disabled={loading}>
					{loading ? "Saving..." : "Save Article"}
				</Button>
			</XStack>
		</YStack>
	);
}
