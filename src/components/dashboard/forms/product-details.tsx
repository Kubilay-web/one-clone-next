"use client";

// React, Next.js
import { FC, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Prisma model
import { Category, SubCategory } from "@prisma/client";

// ReactTags
import { WithOutContext as ReactTags } from "react-tag-input";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { ProductFormSchema } from "@/lib/validation";
import { upsertProduct } from "@/queries/product";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../shared/image-upload";
import { useToast } from "@/components/ui/use-toast";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ClickToAddInputs from "./click-to-add";
import JoditEditor from "jodit-react";

// Utils
import { v4 } from "uuid";
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllSubCategoriesForCategory } from "@/queries/category";

// React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  storeUrl: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  // Initializing necessary hooks
  const { toast } = useToast();
  const router = useRouter(); // Hook for routing

  const productDescEditor = useRef(null);
  const variantDescEditor = useRef(null);

  // Temporary state for images
  const [images, setImages] = useState<{ url: string }[]>([]);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }],
  );

  // Handle keywords input
  const [keywords, setKeywords] = useState<string[]>(data?.keywords || []);

  interface Keyword {
    id: string;
    text: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = (i: number) => {
    setKeywords(keywords.filter((_, index) => index !== i));
  };

  // State for sizes
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >(data?.sizes || [{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

  // State for productSpec
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  // State for product variant specs
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  // State for product variant specs
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  // State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(ProductFormSchema), // Resolver for form validation
    defaultValues: {
      name: data?.name,
      description: data?.description,
      variantName: data?.variantName,
      variantDescription: data?.variantDescription,
      images: data?.images || [],
      variantImage: data?.variantImage ? [{ url: data.variantImage }] : [],
      categoryId: data?.categoryId,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand,
      sku: data?.sku,
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      product_specs: data?.product_specs,
      variant_specs: data?.variant_specs,
      keywords: data?.keywords,
      questions: data?.questions,
      isSale: data?.isSale,
      saleEndDate:
        data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    },
  });

  useEffect(() => {
    const getSubCategories = async () => {
      const res = await getAllSubCategoriesForCategory(form.watch().categoryId);
      setSubCategories(res);
    };
    getSubCategories();
  }, [form.watch().categoryId]);

  const errors = form.formState.errors;
  console.log(errors);

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({ ...data, variantImage: [{ url: data.variantImage }] });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      const response = await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name: values.name,
          description: values.description,
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          images: values.images,
          variantImage: values.variantImage[0].url,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          isSale: values.isSale || false,
          saleEndDate: values.saleEndDate,
          brand: values.brand,
          sku: values.sku,
          colors: values.colors,
          sizes: values.sizes,
          product_specs: values.product_specs,
          variant_specs: values.variant_specs,
          keywords: values.keywords,
          questions: values.questions,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl,
      );

      toast({
        title:
          data?.productId && data.variantId
            ? "Product has been updated."
            : `Congratulations! Product is now created.`,
      });

      // Redirect or Refresh data
      if (data?.productId && data?.variantId) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}`);
      }

      console.log("Submitted form values:", response); // <--- Buraya eklendi
    } catch (error: any) {
      // Handling form submission errors
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString(),
      });
    }
  };

  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
    form.setValue("product_specs", productSpecs);
    form.setValue("variant_specs", variantSpecs);
  }, [colors, sizes, keywords, productSpecs, variantSpecs, data]);

  console.log("form sizes----->", form.watch().sizes);
  console.log("form date------>", form.getValues().saleEndDate);

  console.log("form product_specs----->", form.getValues().product_specs);
  console.log("form variant_specs------>", form.getValues().variant_specs);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?.productId && data.variantId
              ? `Update ${data?.name} product information.`
              : " Lets create a product. You can edit product later from the products page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Logo - Cover */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <>
                          <ImagesPreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url !== url,
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="!mt-4" />
                          <ImageUpload
                            dontShowPreview
                            type="standard"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => {
                              setImages((prevImages) => {
                                const updatedImages = [...prevImages, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              });
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url,
                                ),
                              ])
                            }
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex w-full flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={data?.colors || colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Name */}

              <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product and Description editors */}

              <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="product">Product Description</TabsTrigger>
                  <TabsTrigger value="variant">Variant Description</TabsTrigger>
                </TabsList>
                <TabsContent value="product">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={productDescEditor}
                            value={form.getValues().description}
                            onChange={(content) => {
                              form.setValue("description", content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="variant">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="variantDescription"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={variantDescEditor}
                            value={form.getValues().variantDescription || ""}
                            onChange={(content) => {
                              form.setValue("variantDescription", content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {/* Category */}
              <div className="flex gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        disabled={isLoading || categories.length == 0}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a category"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        disabled={
                          isLoading ||
                          categories.length == 0 ||
                          !form.getValues().categoryId
                        }
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a sub-category"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subCategories.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Brand, Sku, Weight */}
              <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Product brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Product sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Brand, Sku, Weight */}

              {/* Variant image - Keywords*/}
              <div className="flex items-center gap-10 py-14">
                {/* Keywords */}

                <div className="border-r pr-10">
                  <FormField
                    control={form.control}
                    name="variantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-14">Variant Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            dontShowPreview
                            type="profile"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => {
                              field.onChange([{ url }]);
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url,
                                ),
                              ])
                            }
                          />
                        </FormControl>
                        <FormMessage className="!mt-4" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="relative flex-1">
                        <FormLabel>Product Keywords</FormLabel>
                        <FormControl>
                          <ReactTags
                            handleAddition={handleAddition}
                            handleDelete={() => {}}
                            placeholder="Keywords (e.g., winter jacket, warm, stylish)"
                            classNames={{
                              tagInputField:
                                "bg-background border rounded-md p-2 w-full focus:outline-none",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-x-2 rounded-full bg-blue-200 px-3 py-1 text-xs text-blue-700"
                      >
                        <span>{k}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDeleteKeyword(i)}
                        >
                          x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizes */}

              <Tabs defaultValue="productSpecs" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="productSpecs">
                    Product Specifications
                  </TabsTrigger>
                  <TabsTrigger value="variantSpecs">
                    Variant Specifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="productSpecs">
                  <div className="flex w-full flex-col gap-y-3 xl:pl-5">
                    <ClickToAddInputs
                      details={productSpecs}
                      setDetails={setProductSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.product_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.product_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="variantSpecs">
                  <div className="flex w-full flex-col gap-y-3 xl:pl-5">
                    <ClickToAddInputs
                      details={variantSpecs}
                      setDetails={setVariantSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.variant_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.variant_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Questions */}
              <div className="flex w-full flex-col gap-y-3">
                <ClickToAddInputs
                  details={questions}
                  setDetails={setQuestions}
                  initialDetail={{
                    question: "",
                    answer: "",
                  }}
                  header="Questions and Answers"
                />
                {errors.questions && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.questions.message}
                  </span>
                )}
              </div>

              <div className="flex rounded-md border">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>On Sale</FormLabel>
                        <FormDescription>
                          Is this product on sale?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.getValues().isSale && (
                  <FormField
                    control={form.control}
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <DateTimePicker
                            onChange={(date) => {
                              field.onChange(
                                date
                                  ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                  : "",
                              );
                            }}
                            value={field.value ? new Date(field.value) : null}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.productId && data.variantId
                    ? "Save store information"
                    : "Create store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
