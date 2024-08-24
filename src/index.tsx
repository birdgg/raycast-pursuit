import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import type { DeclarationInfo, ItemInfo, SearchItem } from "./types";

const BASE_URL = "https://pursuit.purescript.org";

function isPackage(info: ItemInfo) {
  return info.type === "package";
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const { isLoading, data } = useFetch<SearchItem[]>(
    `${BASE_URL}/search?${new URLSearchParams({ q: searchText }).toString()}`,
    {
      headers: {
        accept: "application/json",
      },
      keepPreviousData: true,
      execute: searchText !== "",
    },
  );
  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isShowingDetail={showDetail}
      onSelectionChange={() => setShowDetail(false)}
      throttle
    >
      {(data || []).map((item, index) => (
        <Item {...item} setShowDetail={setShowDetail} key={index} />
      ))}
    </List>
  );
}

function Item(item: SearchItem & { setShowDetail: (t: boolean) => void }) {
  const { info, package: packageName, url, setShowDetail } = item;
  const title = isPackage(info) ? `Package ${packageName}` : info.title;
  const subtitle = isPackage(info) ? "" : info.typeText;
  const detail = isPackage(info) ? null : <Detail {...item} />;
  return (
    <List.Item
      title={title}
      subtitle={subtitle}
      detail={detail}
      actions={<Actions url={url} setShowDetail={setShowDetail} />}
    />
  );
}

function Detail(item: SearchItem) {
  return <List.Item.Detail markdown={item.text} metadata={<Metadata {...item} />} />;
}

function Metadata({ package: packageName, info, version }: SearchItem) {
  const { typeText, module } = info as DeclarationInfo;
  return (
    <List.Item.Detail.Metadata>
      {typeText !== null ? (
        <>
          <List.Item.Detail.Metadata.Label title="Signature" text={typeText} />
          <List.Item.Detail.Metadata.Separator />
        </>
      ) : null}
      <List.Item.Detail.Metadata.Label title="Package" text={packageName} />
      <List.Item.Detail.Metadata.Label title="Module" text={module} />
      <List.Item.Detail.Metadata.Label title="Version" text={version} />
    </List.Item.Detail.Metadata>
  );
}

function Actions({ url, setShowDetail }: { url: string; setShowDetail: (t: boolean) => void }) {
  return (
    <ActionPanel>
      <Action title="Show Detail" onAction={() => setShowDetail(true)} icon={Icon.AppWindowSidebarRight} />
      <Action.OpenInBrowser url={url} />
    </ActionPanel>
  );
}
